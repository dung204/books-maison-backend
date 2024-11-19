import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BookModule } from '@/modules/book/book.module';
import { FavouriteBook } from '@/modules/favourite-book/entities/favourite-book.entity';
import { FavouriteBookRepository } from '@/modules/favourite-book/repositories/favourite-book.repository';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavouriteBook]), BookModule],
  providers: [FavouriteBookService, FavouriteBookRepository],
  exports: [FavouriteBookService],
})
export class FavouriteBookModule {}
