import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, SecretOrKeyProvider, Strategy } from 'passport-jwt';

import { AuthService } from '@/modules/auth/services/auth.service';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (async (_, rawJwtToken, done) => {
        if (await authService.isTokenBlacklisted(rawJwtToken)) {
          done(new UnauthorizedException('Access token is blacklisted.'));
          return;
        }

        done(null, configService.get<string>('JWT_ACCESS_SECRET'));
      }) satisfies SecretOrKeyProvider<Request>,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const id = payload.sub;
    const user = await this.userRepository.findById(id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
