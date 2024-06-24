import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FavouriteBook } from '@/modules/favourite-book/entities/favourite-book.entity';

@Injectable()
export class FavouriteBookRepository extends Repository<FavouriteBook> {
  constructor(private dataSource: DataSource) {
    super(FavouriteBook, dataSource.createEntityManager());
  }

  async isExistedByUserIdAndBookId(userId: string, bookId: string) {
    return this.existsBy({
      userId,
      bookId,
    });
  }
}
