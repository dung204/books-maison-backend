import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateAuthorDto } from '@/modules/author/dto/create-author.dto';
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

  async createAuthor(createAuthorDto: CreateAuthorDto) {
    const author = new Author();
    Object.assign(author, createAuthorDto);
    await this.save(author);
    return author;
  }
}
