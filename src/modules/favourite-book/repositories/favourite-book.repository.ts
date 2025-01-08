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

  async deleteByUserIdAndBookId(userId: string, bookId: string) {
    const result = await this.delete({
      userId,
      bookId,
    });

    return result.affected !== 0;
  }
}
