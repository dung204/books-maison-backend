import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

import { MediaController } from '@/modules/media/controllers/media.controller';
import { MediaService } from '@/modules/media/services/media.service';

@Module({
  controllers: [MediaController],
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: () =>
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        }),
    },
    MediaService,
  ],
})
export class MediaModule {}
