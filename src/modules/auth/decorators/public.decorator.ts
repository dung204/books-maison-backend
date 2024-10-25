import { applyDecorators } from '@nestjs/common';
import { ApiConsumes, ApiInternalServerErrorResponse } from '@nestjs/swagger';

/**
 * Denotes this route is public - can be accessed by everyone
 */
export function Public() {
  return applyDecorators(
    ApiConsumes('application/x-www-form-urlencoded', 'application/json'),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }),
  );
}
