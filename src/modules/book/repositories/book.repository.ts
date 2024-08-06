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
    language: languages,
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

    const bookIdsContainingAuthorName = new Set(
      await this.findBookIdsContainingAuthorName(authorName),
    );
    const bookIdsContainingCategoryIds = new Set(
      await this.findBookIdsContainingCategoryIds(categoryIds),
    );
    const bookIdsContainingTitle = new Set(
      await this.findBookIdsContainingTitle(title),
    );
    const bookIdsContainingPublisher = new Set(
      await this.findBookIdsContainingPublisher(publisher),
    );
    const bookIdsContainingLanguages = new Set(
      await this.findBookIdsContainingLanguages(languages),
    );
    const bookIdsContainingPublishedYearBetween = new Set(
      await this.findBookIdsContainingPublishedYearBetween(
        publishedYearFrom,
        publishedYearTo,
      ),
    );
    const bookIdsContainingNumberOfPagesBetween = new Set(
      await this.findBookIdsContainingNumberOfPagesBetween(minPages, maxPages),
    );

    const bookIds = Array.from(
      bookIdsContainingAuthorName
        .intersection(bookIdsContainingCategoryIds)
        .intersection(bookIdsContainingTitle)
        .intersection(bookIdsContainingPublisher)
        .intersection(bookIdsContainingLanguages)
        .intersection(bookIdsContainingPublishedYearBetween)
        .intersection(bookIdsContainingNumberOfPagesBetween),
    );

    if (bookIds.length > 0) {
      query.where('book.id IN (:...bookIds)', { bookIds });
    } else {
      query.where('FALSE');
    }

    return query.getManyAndCount();
  }

  async findBookIdsContainingAuthorName(authorName: string) {
    const query = this.createQueryBuilder('book').leftJoinAndSelect(
      'book.authors',
      'author',
    );

    if (authorName) {
      query.where('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      });
    }

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingCategoryIds(categoryIds: string[]) {
    const query = this.createQueryBuilder('book').leftJoinAndSelect(
      'book.categories',
      'category',
    );

    if (categoryIds) {
      categoryIds = categoryIds.filter((id) => id !== '');

      if (categoryIds.length !== 0) {
        query.where('category.id IN (:...categoryIds)', { categoryIds });
      }
    }

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingTitle(title: string) {
    const query = this.createQueryBuilder('book');

    if (title) {
      query.where('LOWER(book.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingPublisher(publisher: string) {
    const query = this.createQueryBuilder('book');

    if (publisher) {
      query.where('LOWER(book.publisher) LIKE LOWER(:publisher)', {
        publisher: `%${publisher}%`,
      });
    }

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingLanguages(languages: string[]) {
    const query = this.createQueryBuilder('book').leftJoinAndSelect(
      'book.categories',
      'category',
    );

    if (languages) {
      languages = languages.filter((language) => language !== '');

      if (languages.length !== 0) {
        query.where('book.language IN (:...languages)', { languages });
      }
    }

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingPublishedYearBetween(
    publishedYearFrom: number,
    publishedYearTo: number,
  ) {
    const query = this.createQueryBuilder('book');

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

    return (await query.getMany()).map((book) => book.id);
  }

  async findBookIdsContainingNumberOfPagesBetween(
    minPages: number,
    maxPages: number,
  ) {
    const query = this.createQueryBuilder('book');

    if (minPages) {
      query.andWhere('book.numberOfPages >= :minPages', {
        minPages,
      });
    }

    if (maxPages) {
      query.andWhere('book.numberOfPages <= :maxPages', {
        maxPages,
      });
    }

    return (await query.getMany()).map((book) => book.id);
  }
}
