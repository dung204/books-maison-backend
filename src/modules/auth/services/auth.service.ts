import { InjectRedis } from '@liaoliaots/nestjs-redis';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';

import { Role } from '@/base/common/enum/role.enum';
import { JwtConfigOptions } from '@/base/config/jwt.config';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  private readonly BLACKLISTED = 'BLACKLISTED';

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user?.password === password) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login({ id, role }: User) {
    return {
      id,
      role,
      ...(await this.getTokens(id, role)),
    };
  }

  async refresh({ id, role }: User, accessToken: string, refreshToken: string) {
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
      id,
      role,
      ...(await this.getTokens(id, role)),
    };
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
