import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import {
  databaseConfig,
  googleOauthConfig,
  jwtConfig,
  redisConfig,
} from '@/base/config';
import { DatabaseModule } from '@/base/database';
import { AuthModule } from '@/modules/auth';
import { AuthorModule } from '@/modules/author';
import { BookModule } from '@/modules/book';
import { CategoryModule } from '@/modules/category';
import { CheckoutModule } from '@/modules/checkout';
import { FavouriteBookModule } from '@/modules/favourite-book';
import { FineModule } from '@/modules/fine';
import { MeModule } from '@/modules/me';
import { MediaModule } from '@/modules/media';
import { TransactionModule } from '@/modules/transaction';
import { UserModule } from '@/modules/user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, jwtConfig, googleOauthConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    RedisModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (configService) =>
          (configService as ConfigService).getOrThrow<RedisModuleOptions>(
            'redis',
          ),
      },
      true,
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'static'),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      global: true,
    }),
    DatabaseModule,
    MediaModule,
    AuthModule,
    UserModule,
    MeModule,
    BookModule,
    FavouriteBookModule,
    AuthorModule,
    CategoryModule,
    CheckoutModule,
    FineModule,
    TransactionModule,
  ],
})
export class AppModule {}
