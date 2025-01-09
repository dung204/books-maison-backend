import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { Private, PrivateDecoratorOptions } from '@/modules/auth/decorators';
import { AdminGuard, JwtAccessGuard } from '@/modules/auth/guards';

type AdminDecoratorOptions = PrivateDecoratorOptions;

/**
 * Denotes this route is for ADMIN only
 */
export function Admin(options?: AdminDecoratorOptions) {
  return applyDecorators(
    Private(options),
    UseGuards(JwtAccessGuard, AdminGuard),
    ApiForbiddenResponse({
      description: 'The current authenticated user is not an ADMIN.',
    }),
  );
}
