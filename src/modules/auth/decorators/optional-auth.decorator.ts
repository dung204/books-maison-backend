import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Public } from '@/modules/auth/decorators/public.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';

export const IS_OPTIONAL_AUTH_KEY = 'isOptionalAuth';

/**
 * Denotes a route as optional auth - can be used as a public route, and Authorization header will be validated whenever available
 */
export function OptionalAuth() {
  return applyDecorators(
    Public(),
    SetMetadata(IS_OPTIONAL_AUTH_KEY, true),
    ApiBearerAuth('JWT'),
    UseGuards(JwtAccessGuard),
  );
}
