import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckoutModule } from '@/modules/checkout/checkout.module';
import { FavouriteBookModule } from '@/modules/favourite-book/favourite-book.module';
import { FineModule } from '@/modules/fine/fine.module';
import { MeController } from '@/modules/me/controllers/me.controller';
import { Avatar } from '@/modules/me/entities/avatar.entity';
import { AvatarRepository } from '@/modules/me/repositories/avatar.repository';
import { AvatarService } from '@/modules/me/services/avatar.service';
import { MediaModule } from '@/modules/media/media.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Avatar]),
    UserModule,
    FavouriteBookModule,
    CheckoutModule,
    FineModule,
    TransactionModule,
    MediaModule,
  ],
  controllers: [MeController],
  providers: [AvatarService, AvatarRepository],
})
export class MeModule {}
