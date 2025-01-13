import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookModule } from '@/modules/book';
import { CheckoutController } from '@/modules/checkout/controllers';
import { Checkout } from '@/modules/checkout/entities';
import { CheckoutRepository } from '@/modules/checkout/repositories';
import { CheckoutService } from '@/modules/checkout/services';
import { FineModule } from '@/modules/fine';
import { UserModule } from '@/modules/user';

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
