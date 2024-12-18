import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookModule } from '@/modules/book/book.module';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutRepository } from '@/modules/checkout/repositories/checkout.repository';
import { CheckoutService } from '@/modules/checkout/services/checkout.service';
import { FineModule } from '@/modules/fine/fine.module';
import { UserModule } from '@/modules/user/user.module';

import { CheckoutController } from './controllers/checkout.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkout]),
    BookModule,
    UserModule,
    FineModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutRepository],
  exports: [CheckoutService],
})
export class CheckoutModule {}
