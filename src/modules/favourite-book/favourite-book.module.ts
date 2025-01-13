import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookModule } from '@/modules/book';
import { FavouriteBook } from '@/modules/favourite-book/entities';
import { FavouriteBookRepository } from '@/modules/favourite-book/repositories';
import { FavouriteBookService } from '@/modules/favourite-book/services';

@Module({
  imports: [TypeOrmModule.forFeature([FavouriteBook]), BookModule],
  providers: [FavouriteBookService, FavouriteBookRepository],
  exports: [FavouriteBookService],
})
export class FavouriteBookModule {}
