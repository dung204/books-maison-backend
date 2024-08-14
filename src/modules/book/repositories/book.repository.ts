import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { BookOrderableField } from '@/modules/book/enums/book-orderable-field.enum';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async findById(id: string) {
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .where('book.id = :id', { id });

    return query.getOne();
  }

  async findAllAndCount({
    page,
    pageSize,
    orderBy,
    order,
    authorName,
    title,
    publisher,
    language,
    minPages,
    maxPages,
    publishedYearFrom,
    publishedYearTo,
    categoryId: categoryIds,
  }: BookSearchDto) {
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(BookOrderableField).includes(orderBy)
      ? orderBy
      : BookOrderableField.CREATED_TIMESTAMP;
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .orderBy(`book.${actualOrderBy}`, order)
      .skip(skip)
      .take(pageSize);

    if (title) {
      query.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (minPages) {
      query.andWhere('book.numberOfPages >= :minPages', { minPages });
    }

    if (maxPages) {
      query.andWhere('book.numberOfPages <= :maxPages', { maxPages });
    }

    if (publishedYearFrom) {
      query.andWhere('book.publishedYear >= :publishedYearFrom', {
        publishedYearFrom,
      });
    }

    if (publishedYearTo) {
      query.andWhere('book.publishedYear <= :publishedYearTo', {
        publishedYearTo,
      });
    }

    if (publisher) {
      query.andWhere('LOWER(book.publisher) LIKE LOWER(:publisher)', {
        publisher: `%${publisher}%`,
      });
    }

    if (language) {
      query.andWhere('LOWER(book.language) LIKE LOWER(:language)', {
        language: `%${language}%`,
      });
    }

    if (authorName) {
      const bookIds = await this.findBookIdsContainingAuthorName(authorName);
      query.andWhereInIds(bookIds);
    }

    if (categoryIds) {
      categoryIds = categoryIds.filter((id) => id !== '');
      if (categoryIds.length !== 0) {
        const bookIds =
          await this.findBookIdsContainingCategoryIds(categoryIds);
        query.andWhereInIds(bookIds);
      }
    }

    return query.getManyAndCount();
  }

  private async findBookIdsContainingAuthorName(authorName: string) {
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .select('book.id')
      .where('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      });

    const books = await query.getMany();
    return books.map((book) => book.id);
  }

  private async findBookIdsContainingCategoryIds(categoryIds: string[]) {
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .select('book.id')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    const books = await query.getMany();
    return books.map((book) => book.id);
  }
}
