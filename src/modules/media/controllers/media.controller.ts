import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { Private } from '@/modules/auth/decorators';
import { CustomUploadedFile } from '@/modules/media/decorators';
import {
  DeleteMediaDto,
  UploadQueryDto,
  UploadSuccessDto,
} from '@/modules/media/dtos';
import { MediaService } from '@/modules/media/services';

@ApiTags('media')
@Controller('/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Private({
    filesUpload: {
      enabled: true,
      fieldName: 'file',
    },
  })
  @ApiOperation({
    summary: 'Upload media files to Cloudinary',
    description:
      'By default, the uploaded images are in `webp` format, and uploaded videos are in `webm` format. However, they can be retrieved with different file format using Cloudinary API.',
  })
  @ApiSuccessResponse({
    description: 'Media is uploaded successfully',
    schema: UploadSuccessDto,
    status: HttpStatus.CREATED,
    isArray: false,
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request due to one of the following reasons:\n- File type is neither `image/*` nor `video/*` nor `audio/*`\n- Image file size is larger than 10MB\n- Audio/Video file size is larger than 100MB\n- File is missing',
  })
  @Post('upload')
  uploadFile(
    @CustomUploadedFile() file: Express.Multer.File,
    @Query() uploadQueryDto: UploadQueryDto,
  ) {
    return this.mediaService.uploadFile(file, uploadQueryDto.folder);
  }

  @Private()
  @ApiOperation({
    summary: 'Delete media files from Cloudinary',
  })
  @ApiNoContentResponse({
    description: 'Media is deleted from Cloudinary successfully',
  })
  @ApiNotFoundResponse({
    description: 'Media is not found',
  })
  @Delete('delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFile(@Body() deleteMediaDto: DeleteMediaDto) {
    return this.mediaService.deleteFile(deleteMediaDto);
  }
}
