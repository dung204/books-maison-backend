import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';

import { Private, PrivateDecoratorOptions } from './private.decorator';

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
