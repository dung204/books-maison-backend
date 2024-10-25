import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_: any, user: TUser): TUser {
    if (!user) {
      throw new UnauthorizedException('User login is required.');
    }
    return user;
  }
}
