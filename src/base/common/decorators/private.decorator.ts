import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { Public } from '@/base/common/decorators/public.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';

/**
 * Denotes this route is private - requires authentication
 */
export function Private() {
  return applyDecorators(
    Public(),
    ApiBearerAuth('JWT'),
    ApiUnauthorizedResponse({
      description: 'User login is required',
    }),
    UseGuards(JwtAccessGuard),
  );
}
