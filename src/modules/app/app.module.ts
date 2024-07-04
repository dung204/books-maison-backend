import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import databaseConfig from '@/base/config/database.config';
import jwtConfig from '@/base/config/jwt.config';
import redisConfig from '@/base/config/redis.config';
import { DatabaseModule } from '@/base/database/database.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AuthorModule } from '@/modules/author/author.module';
import { BookModule } from '@/modules/book/book.module';
import { CategoryModule } from '@/modules/category/category.module';
import { CheckoutModule } from '@/modules/checkout/checkout.module';
import { FavouriteBookModule } from '@/modules/favourite-book/favourite-book.module';
import { FineModule } from '@/modules/fine/fine.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { UserModule } from '@/modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, jwtConfig],
    }),
    RedisModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: (configService: ConfigService) =>
          configService.getOrThrow<RedisModuleOptions>('redis'),
      },
      true,
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'static'),
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    BookModule,
    FavouriteBookModule,
    AuthorModule,
    CategoryModule,
    CheckoutModule,
    FineModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
