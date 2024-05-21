import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, SecretOrKeyProvider, Strategy } from 'passport-jwt';

import { AuthService } from '@/modules/auth/services/auth.service';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
