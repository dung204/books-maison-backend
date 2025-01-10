import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

import { StringUtils } from '@/base/utils';

type TransformParams = Partial<Parameters<typeof Transform>>;

/**
 * This decorator also ignores all validator if the value is SQL's `NULL`
 */
export function SQLNullableTransform(...args: TransformParams) {
  return applyDecorators(
    ValidateIf((_, value) => value !== StringUtils.SQL_NULL),
    Transform(
      (params) =>
        !args[0] || params.value === StringUtils.SQL_NULL
          ? params.value
          : args[0](params),
      args[1],
    ),
  );
}
