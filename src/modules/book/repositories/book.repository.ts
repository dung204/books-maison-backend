import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Book } from '@/modules/book/entities/book.entity';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }
}
