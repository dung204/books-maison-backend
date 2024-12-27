import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { GoogleOAuthConfigOptions } from '@/base/config/google-oauth.config';
import { JwtConfigOptions } from '@/base/config/jwt.config';
import { PasswordUtils } from '@/base/utils/password.utils';
import { OAuthAction } from '@/modules/auth/enums/oauth-action.enum';
import { GoogleRequest } from '@/modules/auth/requests/google.request';
import { RegisterRequest } from '@/modules/auth/requests/register.request';
import { GoogleUserInfoResponse } from '@/modules/auth/responses/google-user-info.response';
import { LoginSuccessResponse } from '@/modules/auth/responses/login-success.response';
import { RefreshSuccessResponse } from '@/modules/auth/responses/refresh-success.response';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { AvatarService } from '@/modules/me/services/avatar.service';
import { MediaService } from '@/modules/media/services/media.service';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  private readonly BLACKLISTED = 'BLACKLISTED';
  private readonly redis: Redis;

  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly mediaService: MediaService,
    private readonly avatarService: AvatarService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async register(
    registerRequest: RegisterRequest,
  ): Promise<SuccessResponse<UserDto>> {
    const { email, password } = registerRequest;
    const existedUser = await this.userRepository.findByEmail(email);

    if (existedUser) throw new ConflictException('Email already taken');

    const createdUser = this.userRepository.create({
      ...registerRequest,
      password: await PasswordUtils.hashPassword(password),
    });
    const user = await this.userRepository.save(createdUser);

    return {
      data: UserDto.fromUser(user),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (
      user &&
      (await PasswordUtils.isPasswordMatched(password, user.password))
    )
      return user;

    return null;
  }

  async login({ id, role }: User): Promise<LoginSuccessResponse> {
    return {
      data: {
        id,
        role,
        ...(await this.getTokens(id, role)),
      },
    };
  }

  async refresh(refreshToken: string): Promise<RefreshSuccessResponse> {
    if (await this.isTokenBlacklisted(refreshToken)) {
      throw new UnauthorizedException('Refresh token is blacklisted.');
    }

    const { refreshSecret } =
      this.configService.getOrThrow<JwtConfigOptions>('jwt');

    const { sub: userId } = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: refreshSecret,
    });
    const { id, role } = await this.userRepository.findById(userId);

    await this.blacklistToken(refreshToken);

    return {
      data: {
        id,
        role,
        ...(await this.getTokens(id, role)),
      },
    };
  }

  async logout({ id }: User, accessToken: string) {
    const refreshToken = await this.redis.getdel(id);

    await this.blacklistToken(accessToken);
    await this.blacklistToken(refreshToken);
  }

  async getTokens(userId: string, role: Role) {
    const { accessSecret, accessExpiration, refreshSecret, refreshExpiration } =
      this.configService.getOrThrow<JwtConfigOptions>('jwt');

    const refreshPayload: JwtPayload = {
      sub: userId,
    };

    const accessPayload: JwtPayload = {
      ...refreshPayload,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: accessSecret,
        expiresIn: accessExpiration,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiration,
      }),
    ]);

    await this.redis.set(userId, refreshToken, 'EX', refreshExpiration);

    return {
      accessToken,
      refreshToken,
    };
  }

  async blacklistToken(token: string) {
    const { exp } = this.jwtService.decode<JwtPayload>(token);
    await this.redis.set(token, this.BLACKLISTED, 'EXAT', exp);
  }

  async isTokenBlacklisted(token: string) {
    return (await this.redis.get(token)) === this.BLACKLISTED;
  }

  async handleGoogleAuth({ code, action }: GoogleRequest) {
    const accessToken = await this.getGoogleAccessToken(code);
    const googleUserInfo = await this.getGoogleUserInfo(accessToken);
    const existingUser = await this.userService.findUserByEmail(
      googleUserInfo.email,
    );

    switch (action) {
      case OAuthAction.AUTHENTICATE:
        if (!existingUser) {
          const newUser = await this.handleGoogleOverride(
            new User(),
            googleUserInfo,
          );
          return this.login(newUser);
        }

        if (existingUser.googleId !== googleUserInfo.id) {
          throw new ConflictException({
            message: 'Found a user account that is not linked to Google.',
            extra: Buffer.from(
              JSON.stringify({
                googleUserInfo,
                existingUser: UserDto.fromUser(existingUser),
              }),
            ).toString('base64'),
          });
        }

        return this.login(existingUser);

      case OAuthAction.LINK:
        if (existingUser.googleId) {
          throw new ConflictException(
            'Can not link because a user already linked to Google has been found.',
          );
        }

        existingUser.googleId = googleUserInfo.id;
        const linkedUser = await this.userRepository.save(existingUser);
        return this.login(linkedUser);

      case OAuthAction.OVERRIDE:
        const overriddenUser = await this.handleGoogleOverride(
          existingUser,
          googleUserInfo,
        );
        return this.login(overriddenUser);
    }
  }

  private async handleGoogleOverride(
    user: User,
    googleUserInfo: GoogleUserInfoResponse,
  ) {
    if (user.googleId) {
      throw new ConflictException(
        'Can not link because a user already linked to Google has been found.',
      );
    }

    user.email = googleUserInfo.email;
    user.firstName = googleUserInfo.given_name;
    user.lastName = googleUserInfo.family_name;
    user.googleId = googleUserInfo.id;
    const overriddenUser = await this.userRepository.save(user);

    const { width, height, public_id } = await this.mediaService.uploadFromUrl(
      googleUserInfo.picture,
      'avatars',
    );

    await this.avatarService.setAvatar(overriddenUser, {
      id: public_id.replaceAll('avatars/', ''),
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
      baseDimension: Math.min(width, height),
    });

    return overriddenUser;
  }

  private async getGoogleAccessToken(code: string): Promise<string> {
    const {
      data: { access_token },
    } = await this.httpService.axiosRef.post(
      'https://accounts.google.com/o/oauth2/token',
      {
        code,
        ...this.configService.getOrThrow<GoogleOAuthConfigOptions>(
          'google_oauth',
        ),
      },
    );

    return access_token;
  }

  private async getGoogleUserInfo(accessToken: string) {
    const { data } =
      await this.httpService.axiosRef.get<GoogleUserInfoResponse>(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

    return data;
  }
}
