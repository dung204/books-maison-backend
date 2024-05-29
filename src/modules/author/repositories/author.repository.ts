import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Author } from '@/modules/author/entities/author.entity';

@Injectable()
export class AuthorRepository extends Repository<Author> {
  constructor(private dataSource: DataSource) {
    super(Author, dataSource.createEntityManager());
  }

  findById(id: string) {
    return this.findOneBy({ id });
  }

  isExistedById(id: string) {
    return this.existsBy({ id });
  }
}
