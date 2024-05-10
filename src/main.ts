import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  StorageDriver,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import { configSwagger } from '@/base/config/swagger.config';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  configSwagger(app);

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  app.enableCors();

  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  await app.listen(process.env.PORT || 3000, () => {
    logger.log(`Server is running on port: ${process.env.PORT || 3000}`);
  });
}
bootstrap();
