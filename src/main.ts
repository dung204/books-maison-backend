import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AxiosError } from 'axios';
import * as fs from 'fs';
import {
  StorageDriver,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import { configSwagger } from '@/base/config/swagger.config';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    ...(process.env['USE_HTTPS'] === 'true' && {
      httpsOptions: {
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem'),
      },
    }),
  });
  const httpService = new HttpService();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  configSwagger(app);

  app.enableCors({
    origin: process.env['FE_URL'],
  });

  httpService.axiosRef.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const response = error.response;
      throw new HttpException(error.response.data, response.status);
    },
  );

  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  await app.listen(process.env['APP_PORT'] || 3000, () => {
    logger.log(`Server is running on port: ${process.env['APP_PORT'] || 3000}`);
  });
}
bootstrap();
