import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BookOrderableField } from '@/modules/book/enums/book-orderable-field.enum';
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
      language,
      minPages,
      maxPages,
      publishedYearFrom,
      publishedYearTo,
      categoryId: categoryIds,
    }: FavouriteBookSearchDto,
  ) {
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(BookOrderableField).includes(orderBy)
      ? orderBy
      : BookOrderableField.CREATED_TIMESTAMP;
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .andWhere('favouriteBook.userId = :userId', { userId })
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

    const [favouriteBooks, count] = await query.getManyAndCount();
    const books = favouriteBooks.map((favouriteBook) => favouriteBook.book);
    return [books, count] as const;
  }

  private async findBookIdsContainingAuthorName(authorName: string) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .select('book.id')
      .where('LOWER(author.name) LIKE LOWER(:authorName)', {
        authorName: `%${authorName}%`,
      });

    const favouriteBooks = await query.getMany();
    return favouriteBooks.map((favouriteBook) => favouriteBook.book.id);
  }

  private async findBookIdsContainingCategoryIds(categoryIds: string[]) {
    const query = this.createQueryBuilder('favouriteBook')
      .leftJoinAndSelect('favouriteBook.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .select('book.id')
      .where('category.id IN (:...categoryIds)', { categoryIds });

    const favouriteBooks = await query.getMany();
    return favouriteBooks.map((favouriteBook) => favouriteBook.book.id);
  }
}
