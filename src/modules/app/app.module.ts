import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import databaseConfig from '@/base/config/database.config';
import { DatabaseModule } from '@/base/database/database.module';
import { AuthorModule } from '@/modules/author/author.module';
import { BookModule } from '@/modules/book/book.module';
import { CategoryModule } from '@/modules/category/category.module';
import { CheckoutModule } from '@/modules/checkout/checkout.module';
import { FineModule } from '@/modules/fine/fine.module';
import { UserModule } from '@/modules/user/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    DatabaseModule,
    UserModule,
    BookModule,
    AuthorModule,
    CategoryModule,
    CheckoutModule,
    FineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
