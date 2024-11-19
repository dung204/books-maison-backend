import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Role } from '@/base/common/enum/role.enum';
import { CustomRequest } from '@/base/common/types/custom-request.type';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const currentUser = context.switchToHttp().getRequest<CustomRequest>().user;
    if (currentUser.role !== Role.ADMIN)
      throw new ForbiddenException('This operation is only allowed for ADMIN.');
    return true;
  }
}
