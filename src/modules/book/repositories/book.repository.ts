import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { rawToEntity } from '@/base/utils/raw-to-entity.util';
import { StringUtils } from '@/base/utils/string.utils';
import { Author } from '@/modules/author/entities/author.entity';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { BookDto } from '@/modules/book/dto/book.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { BookOrderableField } from '@/modules/book/enums/book-orderable-field.enum';
import { Category } from '@/modules/category/entities/category.entity';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutStatus } from '@/modules/checkout/enums/checkout-status.enum';
import { FavouriteBook } from '@/modules/favourite-book/entities/favourite-book.entity';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(private dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async findById(id: string, user?: User) {
    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .where('book.id = :id', { id });

    this.addSelectUserData(query, user);

    const rawResults = await query.getRawMany();

    if (rawResults.length === 0) return null;

    const result = rawToEntity(BookDto, rawResults[0], 'book');
    result.categories = [];
    result.authors = [];

    if (user) {
      result.userData = {
        isBorrowing: rawResults[0].isBorrowing,
        isFavouring: rawResults[0].isFavouring,
      };
    }

    rawResults.forEach((item) => {
      const categoryId = item['category_id'];
      const authorId = item['author_id'];

      if (!result.categories.find((c) => c.id === categoryId)) {
        result.categories.push(rawToEntity(Category, item, 'category'));
      }

      if (!result.authors.find((c) => c.id === authorId)) {
        result.authors.push(rawToEntity(Author, item, 'author'));
      }
    });

    return result;
  }

  async findAllAndCount(
    bookSearchDto: BookSearchDto,
    user?: User,
  ): Promise<[Book[], number]> {
    const actualOrderBy = Object.values(BookOrderableField).includes(
      bookSearchDto.orderBy,
    )
      ? bookSearchDto.orderBy
      : BookOrderableField.CREATED_TIMESTAMP;
    const subQuery = await this.findAllSubQuery(bookSearchDto);

    const query = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .where(`book.id IN (${subQuery.getQuery()})`)
      .orderBy(`book.${actualOrderBy}`, bookSearchDto.order);

    const countQuery = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category');

    await this.setFindAllFilter(countQuery, bookSearchDto);

    this.addSelectUserData(query, user);

    const rawBooks = await query.getRawMany();
    const mappedBooks: Record<string, BookDto> = {};

    rawBooks.forEach((book) => {
      const bookId = book['book_id'];
      const categoryId = book['category_id'];
      const authorId = book['author_id'];

      if (mappedBooks[bookId]) {
        if (!mappedBooks[bookId].categories.find((c) => c.id === categoryId)) {
          mappedBooks[bookId].categories.push(
            rawToEntity(Category, book, 'category'),
          );
        }

        if (!mappedBooks[bookId].authors.find((c) => c.id === authorId)) {
          mappedBooks[bookId].authors.push(rawToEntity(Author, book, 'author'));
        }

        return;
      }

      mappedBooks[bookId] = {
        ...rawToEntity(Book, book, 'book'),
        categories: [rawToEntity(Category, book, 'category')],
        authors: [rawToEntity(Author, book, 'author')],
        ...(user && {
          userData: {
            isFavouring: book.isFavouring,
            isBorrowing: book.isBorrowing,
          },
        }),
      };
    });

    return [Object.values(mappedBooks), await countQuery.getCount()];
  }

  private async findAllSubQuery(bookSearchDto: BookSearchDto) {
    const { page, pageSize, orderBy, order } = bookSearchDto;
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(BookOrderableField).includes(orderBy)
      ? orderBy
      : BookOrderableField.CREATED_TIMESTAMP;

    const subQuery1 = this.createQueryBuilder('book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category');

    await this.setFindAllFilter(subQuery1, bookSearchDto);

    const subQuery2 = this.dataSource
      .createQueryBuilder()
      .select(
        `DISTINCT "distinctAlias"."book_id", "distinctAlias"."book_${StringUtils.camelToSnake(actualOrderBy)}"`,
      )
      .from(`(${subQuery1.getQuery()})`, 'distinctAlias')
      .orderBy(
        `"distinctAlias"."book_${StringUtils.camelToSnake(actualOrderBy)}"`,
        order,
      )
      .addOrderBy(`"distinctAlias"."book_id"`, 'ASC')
      .limit(pageSize)
      .offset(skip);

    return this.dataSource
      .createQueryBuilder()
      .select(`DISTINCT "temp"."book_id"`)
      .addOrderBy(`"temp"."book_id"`, 'ASC')
      .from(`(${subQuery2.getQuery()})`, 'temp');
  }

  private addSelectUserData(query: SelectQueryBuilder<Book>, user?: User) {
    if (user) {
      query
        .leftJoin(
          FavouriteBook,
          'favouriteBook',
          'book.id = favouriteBook.bookId',
        )
        .leftJoin(Checkout, 'checkout', 'checkout.book.id = book.id')
        .addSelect(
          `CASE WHEN EXISTS${this.isUserFavouringSubQuery(query, user.id)} THEN true ELSE false END`,
          'isFavouring',
        )
        .addSelect(
          `CASE WHEN EXISTS${this.isUserBorrowingSubQuery(query, user.id)} THEN true ELSE false END`,
          'isBorrowing',
        );
    }
  }

  private isUserFavouringSubQuery(
    query: SelectQueryBuilder<Book>,
    userId: string,
  ) {
    return query
      .subQuery()
      .select('*')
      .from(FavouriteBook, 'favouriteBook')
      .where(`favouriteBook.userId = '${userId}'`)
      .andWhere('favouriteBook.bookId = book.id')
      .getQuery();
  }

  private isUserBorrowingSubQuery(
    query: SelectQueryBuilder<Book>,
    userId: string,
  ) {
    return query
      .subQuery()
      .select('*')
      .from(Checkout, 'checkout')
      .where(`checkout.user.id = '${userId}'`)
      .andWhere('checkout.book.id = book.id')
      .andWhere(
        `checkout.status IN ('${CheckoutStatus.BORROWING}', '${CheckoutStatus.OVERDUE}')`,
      )
      .getQuery();
  }

  private async setFindAllFilter(
    query: SelectQueryBuilder<Book>,
    {
      authorName,
      title,
      publisher,
      language,
      minPages,
      maxPages,
      publishedYearFrom,
      publishedYearTo,
      categoryId: categoryIds,
    }: BookSearchDto,
  ) {
    if (title) {
      query.andWhere(`LOWER(book.title) LIKE LOWER('%${title}%')`);
    }

    if (minPages) {
      query.andWhere(`book.numberOfPages >= ${minPages}`);
    }

    if (maxPages) {
      query.andWhere(`book.numberOfPages <= ${maxPages}`);
    }

    if (publishedYearFrom) {
      query.andWhere(`book.publishedYear >= ${publishedYearFrom}`);
    }

    if (publishedYearTo) {
      query.andWhere(`book.publishedYear <= ${publishedYearTo}`);
    }

    if (publisher) {
      query.andWhere(`LOWER(book.publisher) LIKE LOWER('%${publisher}%')`);
    }

    if (language) {
      query.andWhere(`LOWER(book.language) LIKE LOWER('%${language}%')`);
    }

    if (authorName) {
      const bookIds = await this.findBookIdsContainingAuthorName(authorName);
      query.andWhere(
        `book.id IN (${bookIds.map((id) => `'${id}'`).join(',')})`,
      );
    }

    if (categoryIds) {
      categoryIds = categoryIds.filter((id) => id !== '');
      if (categoryIds.length !== 0) {
        const bookIds =
          await this.findBookIdsContainingCategoryIds(categoryIds);
        query.andWhere(
          `book.id IN (${bookIds.map((id) => `'${id}'`).join(',')})`,
        );
      }
    }
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
