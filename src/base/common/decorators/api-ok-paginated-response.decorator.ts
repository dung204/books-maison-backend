import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';

import { Pagination } from '@/base/common/types/pagination.type';

type ApiOkPaginatedResponseOptions<DataDto extends Type<unknown>> = Omit<
  ApiResponseSchemaHost,
  'schema'
> & {
  schema: DataDto;
};

export const ApiOkPaginatedResponse = <DataDto extends Type<unknown>>({
  schema,
  ...options
}: ApiOkPaginatedResponseOptions<DataDto>) => {
  return applyDecorators(
    ApiExtraModels(Pagination, schema),
    ApiOkResponse({
      ...options,
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(schema) },
          },
          pagination: {
            $ref: getSchemaPath(Pagination),
          },
        },
      },
    }),
  );
};
