import { HttpException, Injectable } from '@nestjs/common';
import {
  TransformationOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { UploadSuccessDto } from '@/modules/media/dto/upload-success.dto';

@Injectable()
export class MediaService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<SuccessResponse<UploadSuccessDto>> {
    let transformation: TransformationOptions;

    switch (file.mimetype.split('/')[0]) {
      case 'image':
        transformation = { quality: 'auto', fetch_format: 'webp' };
        break;
      case 'video':
      case 'audio':
        transformation = { quality: 'auto', fetch_format: 'webm' };
        break;
    }

    const [result, error] = await new Promise<
      [UploadApiResponse | null, UploadApiErrorResponse | null]
    >((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { transformation, resource_type: 'auto' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) resolve([null, error]);
          resolve([result, null]);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });

    if (error !== null) {
      throw new HttpException(error.message, error.http_code);
    }

    return {
      data: {
        originalName: file.originalname,
        name: result.public_id,
        url: result.secure_url,
      },
    };
  }
}
