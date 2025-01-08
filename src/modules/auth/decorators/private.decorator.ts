import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import {
  Public,
  PublicDecoratorOptions,
} from '@/modules/auth/decorators/public.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';

export type PrivateDecoratorOptions = PublicDecoratorOptions;

/**
 * Denotes this route is private - requires authentication
 */
export function Private(options?: PrivateDecoratorOptions) {
  return applyDecorators(
    Public(options),
    ApiBearerAuth('JWT'),
    ApiUnauthorizedResponse({
      description:
        'Due to one of the following reasons:\n\n- User login is required\n- User is currently deactivated',
    }),
    UseGuards(JwtAccessGuard),
  );
}
