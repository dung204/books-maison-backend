import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  TransformationOptions,
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { DeleteMediaDto } from '@/modules/media/dto/delete-media.dto';
import { GetMediaDto } from '@/modules/media/dto/get-media.dto';
import { UploadSuccessDto } from '@/modules/media/dto/upload-success.dto';

@Injectable()
export class MediaService {
  async uploadFile(
    file: Express.Multer.File,
    folder?: string,
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
        { transformation, resource_type: 'auto', folder },
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

  async deleteFile({ name, folder }: DeleteMediaDto) {
    const fileName = !folder ? name : `${folder}/${name}`;

    const result = await cloudinary.api.delete_resources(
      [!folder ? name : `${folder}/${name}`],
      {
        type: 'upload',
      },
    );

    if (result.deleted_counts[fileName].original === 0) {
      throw new NotFoundException('Media is not found.');
    }
  }

  /**
   * Checks whether file has already existed in Cloudinary
   */
  async checkFileExists({ name, folder }: GetMediaDto) {
    const fileName = !folder ? name : `${folder}/${name}`;

    try {
      await cloudinary.api.resource(fileName);
    } catch (errRes: any) {
      const { error } = errRes;
      throw new HttpException(error.message, error.http_code);
    }

    return true;
  }
}
