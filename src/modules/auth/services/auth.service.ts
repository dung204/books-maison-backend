import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { JwtConfigOptions } from '@/base/config/jwt.config';
import { PasswordUtils } from '@/base/utils/password.utils';
import { RegisterRequest } from '@/modules/auth/requests/register.request';
import { LoginSuccessResponse } from '@/modules/auth/responses/login-success.response';
import { RefreshSuccessResponse } from '@/modules/auth/responses/refresh-success.response';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class AuthService {
  private readonly BLACKLISTED = 'BLACKLISTED';

  constructor(
    @Inject(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

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

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userRepository.findByEmail(email);

    if (
      user &&
      (await PasswordUtils.isPasswordMatched(password, user.password))
    )
      return UserDto.fromUser(user);

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

  async refresh(
    { id, role }: User,
    accessToken: string,
    refreshToken: string,
  ): Promise<RefreshSuccessResponse> {
    if ((await this.redis.get(id)) !== refreshToken)
      throw new UnauthorizedException('Refresh token does not exist.');

    if (await this.isTokenBlacklisted(refreshToken)) {
      throw new UnauthorizedException('Refresh token is blacklisted.');
    }

    const { sub } = this.jwtService.decode<JwtPayload>(refreshToken);
    if (id !== sub) {
      throw new ForbiddenException(
        'Refresh token and current user are mismatched.',
      );
    }

    await this.blacklistToken(accessToken);
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
}
