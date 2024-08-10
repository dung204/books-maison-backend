import { Module } from '@nestjs/common';

import { CheckoutModule } from '@/modules/checkout/checkout.module';
import { FavouriteBookModule } from '@/modules/favourite-book/favourite-book.module';
import { FineModule } from '@/modules/fine/fine.module';
import { MeController } from '@/modules/me/controllers/me.controller';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    FavouriteBookModule,
    CheckoutModule,
    FineModule,
    TransactionModule,
  ],
  controllers: [MeController],
})
export class MeModule {}
