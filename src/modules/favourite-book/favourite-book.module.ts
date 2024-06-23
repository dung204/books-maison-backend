import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavouriteBookController } from '@/modules/favourite-book/controllers/favourite-book.controller';
import { FavouriteBook } from '@/modules/favourite-book/entities/favourite-book.entity';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavouriteBook])],
  controllers: [FavouriteBookController],
  providers: [FavouriteBookService],
  exports: [FavouriteBookService],
})
export class FavouriteBookModule {}
