import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { Book } from '@/modules/book/entities/book.entity';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async findAllAndCount({
    page,
    pageSize,
    authorName,
    categoryId: categoryIds,
  }: BookSearchDto) {
    const skip = (page - 1) * pageSize;
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .skip(skip)
      .take(pageSize);

    if (authorName) {
      const bookIds = await this.findBookIdsContainingAuthorName(authorName);

      if (bookIds.length > 0) {
        query.orWhere('book.id IN (:...bookIds)', {
          bookIds,
        });
      } else {
        query.orWhere('1 = 0');
      }
    }

    if (categoryIds) {
      const bookIds = await this.findBookIdsContainingCategoryIds(categoryIds);

      if (bookIds.length > 0) {
        query.orWhere('book.id IN (:...bookIds)', {
          bookIds,
        });
      } else {
        query.orWhere('1 = 0');
      }
    }

    return query.getManyAndCount();
  }

  async findBookIdsContainingAuthorName(authorName: string) {
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .where('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      });

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingCategoryIds(categoryIds: string[]) {
    if (categoryIds.length === 0) return [];

    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    return (await query.getMany()).map((book) => book.id);
  }
}
