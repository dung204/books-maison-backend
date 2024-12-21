import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiConsumes, ApiInternalServerErrorResponse } from '@nestjs/swagger';

import { ApiFile } from '@/base/common/decorators/api-file';

export type PublicDecoratorOptions = {
  filesUpload:
    | {
        enabled: true;
        fieldName: string;
        localOptions?: MulterOptions;
      }
    | { enabled: false };
};

/**
 * Denotes this route is public - can be accessed by everyone
 */
export function Public(options?: PublicDecoratorOptions) {
  return applyDecorators(
    ...(options?.filesUpload?.enabled
      ? [
          ApiFile(options.filesUpload.fieldName),
          ApiConsumes('multipart/form-data'),
          UseInterceptors(
            FileInterceptor(
              options.filesUpload.fieldName,
              options.filesUpload.localOptions,
            ),
          ),
        ]
      : [ApiConsumes('application/x-www-form-urlencoded', 'application/json')]),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
    }),
  );
}
