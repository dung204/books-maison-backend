import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user?.password === password) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login({ id, email }: User) {
    return {
      id,
      email,
      ...(await this.getTokens(id, email)),
    };
  }

  async refresh({ id, email }: User, refreshToken: string) {
    const { sub } = this.jwtService.decode<JwtPayload>(refreshToken);
    if (id !== sub)
      throw new ForbiddenException(
        'Refresh token and current user are mismatched.',
      );

    // TODO: blacklist old tokens

    return {
      id,
      email,
      ...(await this.getTokens(id, email)),
    };
  }

  async getTokens(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<number>(
          'JWT_ACCESS_EXPIRATION',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<number>(
          'JWT_REFRESH_EXPIRATION',
        ),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
