import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BOOK_ORDERABLE_FIELDS } from '@/modules/book/constants/book-orderable-fields.constant';
import { FavouriteBookSearchDto } from '@/modules/favourite-book/dto/favourite-book-search.dto';
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

  async findAllByUserIdAndCount(
    userId: string,
    {
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
    }: FavouriteBookSearchDto,
  ) {
    const skip = (page - 1) * pageSize;
    orderBy = BOOK_ORDERABLE_FIELDS.includes(orderBy)
      ? orderBy
      : 'createdTimestamp';
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .andWhere('favouriteBook.userId = :userId', { userId })
      .orderBy(`book.${orderBy}`, order)
      .skip(skip)
      .take(pageSize);

    const bookIdsContainingAuthorName = new Set(
      await this.findBookIdsContainingAuthorName(userId, authorName),
    );
    const bookIdsContainingCategoryIds = new Set(
      await this.findBookIdsContainingCategoryIds(userId, categoryIds),
    );
    const bookIdsContainingTitle = new Set(
      await this.findBookIdsContainingTitle(userId, title),
    );
    const bookIdsContainingPublisher = new Set(
      await this.findBookIdsContainingPublisher(userId, publisher),
    );
    const bookIdsContainingLanguages = new Set(
      await this.findBookIdsContainingLanguages(userId, languages),
    );
    const bookIdsContainingPublishedYearBetween = new Set(
      await this.findBookIdsContainingPublishedYearBetween(
        userId,
        publishedYearFrom,
        publishedYearTo,
      ),
    );
    const bookIdsContainingNumberOfPagesBetween = new Set(
      await this.findBookIdsContainingNumberOfPagesBetween(
        userId,
        minPages,
        maxPages,
      ),
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
      query.andWhere('book.id IN (:...bookIds)', { bookIds });
    } else {
      query.andWhere('FALSE');
    }

    const [favouriteBooks, count] = await query.getManyAndCount();
    const books = favouriteBooks.map((favouriteBook) => favouriteBook.book);
    return [books, count] as const;
  }

  async findBookIdsContainingAuthorName(userId: string, authorName: string) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .andWhere('favouriteBook.userId = :userId', { userId });

    if (authorName) {
      query.andWhere('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      });
    }

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingCategoryIds(
    userId: string,
    categoryIds: string[],
  ) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.categories', 'category')
      .andWhere('favouriteBook.userId = :userId', { userId });

    if (categoryIds) {
      categoryIds = categoryIds.filter((id) => id !== '');

      if (categoryIds.length !== 0) {
        query.andWhere('category.id IN (:...categoryIds)', { categoryIds });
      }
    }

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingTitle(userId: string, title: string) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .andWhere('favouriteBook.userId = :userId', { userId });

    if (title) {
      query.andWhere('LOWER(book.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingPublisher(userId: string, publisher: string) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .andWhere('favouriteBook.userId = :userId', { userId });

    if (publisher) {
      query.andWhere('LOWER(book.publisher) LIKE LOWER(:publisher)', {
        publisher: `%${publisher}%`,
      });
    }

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingLanguages(userId: string, languages: string[]) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .andWhere('favouriteBook.userId = :userId', { userId });

    if (languages) {
      languages = languages.filter((language) => language !== '');

      if (languages.length !== 0) {
        query.andWhere('book.language IN (:...languages)', { languages });
      }
    }

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingPublishedYearBetween(
    userId: string,
    publishedYearFrom: number,
    publishedYearTo: number,
  ) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .andWhere('favouriteBook.userId = :userId', { userId });

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

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }

  async findBookIdsContainingNumberOfPagesBetween(
    userId: string,
    minPages: number,
    maxPages: number,
  ) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .andWhere('favouriteBook.userId = :userId', { userId });

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

    return (await query.getMany()).map(
      (favouriteBook) => favouriteBook.book.id,
    );
  }
}
