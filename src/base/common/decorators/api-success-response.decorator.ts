import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseSchemaHost,
  getSchemaPath,
} from '@nestjs/swagger';

type ApiSuccessResponseOptions<DataDto extends Type<unknown>> = Omit<
  ApiResponseSchemaHost,
  'schema'
> & {
  schema: DataDto;
  isArray: boolean;
  pagination?: boolean;
};

export const ApiSuccessResponse = <DataDto extends Type<unknown>>({
  schema,
  pagination = false,
  isArray,
  ...options
}: ApiSuccessResponseOptions<DataDto>) => {
  return applyDecorators(
    ApiExtraModels(schema),
    ApiResponse({
      ...options,
      schema: {
        properties: {
          data: {
            ...(isArray
              ? {
                  type: 'array',
                  items: { $ref: getSchemaPath(schema) },
                }
              : {
                  $ref: getSchemaPath(schema),
                }),
          },
        },
        ...(pagination && {
          pagination: {
            $ref: getSchemaPath(schema),
          },
        }),
      },
    }),
  );
};
