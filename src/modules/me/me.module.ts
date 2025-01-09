import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckoutModule } from '@/modules/checkout';
import { FavouriteBookModule } from '@/modules/favourite-book';
import { FineModule } from '@/modules/fine';
import { MeController } from '@/modules/me/controllers';
import { Avatar } from '@/modules/me/entities';
import { AvatarRepository } from '@/modules/me/repositories';
import { AvatarService } from '@/modules/me/services';
import { MediaModule } from '@/modules/media';
import { TransactionModule } from '@/modules/transaction';
import { UserModule } from '@/modules/user';

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
  exports: [AvatarService],
})
export class MeModule {}
