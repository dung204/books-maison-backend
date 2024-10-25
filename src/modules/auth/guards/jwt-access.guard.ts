import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_OPTIONAL_AUTH_KEY } from '@/modules/auth/decorators/optional-auth.decorator';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser>(
    err: any,
    user: TUser,
    info: any,
    context: ExecutionContext,
  ): TUser {
    const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_AUTH_KEY,
      [context.getHandler()],
    );

    if (!user) {
      if (isOptionalAuth) return null;

      throw new UnauthorizedException('User login is required.');
    }
    return user;
  }
}
