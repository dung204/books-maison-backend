import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Role } from '@/base/common/enum';
import { CustomRequest } from '@/base/common/types';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const currentUser = context.switchToHttp().getRequest<CustomRequest>().user;
    if (currentUser!.role !== Role.ADMIN)
      throw new ForbiddenException('This operation is only allowed for ADMIN.');
    return true;
  }
}
