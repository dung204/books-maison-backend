import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DeepPartial } from 'typeorm';

import { SuccessResponse } from '@/base/common/responses';
import { AuthorService } from '@/modules/author/services';
import {
  BookDto,
  BookSearchDto,
  CreateBookDto,
  UpdateBookDto,
} from '@/modules/book/dtos';
import { Book } from '@/modules/book/entities';
import { BookRepository } from '@/modules/book/repositories';
import { CategoryService } from '@/modules/category/services';
import { User } from '@/modules/user/entities';

@Injectable()
export class BookService {
  private readonly logger: Logger = new Logger(BookService.name);

  constructor(
    private readonly bookRepository: BookRepository,
    private readonly categoryService: CategoryService,
    private readonly authorService: AuthorService,
  ) {}

  async create({
    authorIds,
    categoryIds,
    ...createBookDto
  }: CreateBookDto): Promise<SuccessResponse<BookDto>> {
    const book = new Book();
    const categories =
      categoryIds &&
      (await Promise.all(
        categoryIds.map((id) => this.categoryService.findCategoryById(id)),
      ));
    const authors =
      authorIds &&
      (await Promise.all(
        authorIds.map((id) => this.authorService.findAuthorById(id)),
      ));

    Object.assign<Book, DeepPartial<Book>>(book, {
      ...createBookDto,
      authors,
      categories,
    });

    return {
      data: BookDto.convert(await this.bookRepository.save(book)),
    };
  }

  async findAll(
    bookSearchDto: BookSearchDto,
    user?: User,
  ): Promise<SuccessResponse<BookDto[]>> {
    const { page, pageSize } = bookSearchDto;
    const [books, total] = await this.bookRepository.findAllAndCount(
      bookSearchDto,
      user,
    );
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: books.map(BookDto.convert),
      pagination: {
        total,
        page,
        pageSize,
        totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAllDeletedOnly(bookSearchDto: BookSearchDto, user?: User) {
    return this.findAll({ ...bookSearchDto, deletedOnly: true }, user);
  }

  async findAllFavouriteBooks(user: User, bookSearchDto: BookSearchDto) {
    return this.findAll({ ...bookSearchDto, filterFavourite: true }, user);
  }

  async findOne(id: string, user?: User) {
    const book = await this.bookRepository.findById(id, user);

    if (!book) throw new NotFoundException('Book not found.');

    return book;
  }

  async update(
    id: string,
    { authorIds, categoryIds, ...updateBookDto }: UpdateBookDto,
  ) {
    const book = await this.findOne(id);

    const categories =
      !categoryIds || categoryIds.length === 0
        ? book.categories
        : await Promise.all(
            categoryIds.map((id) => this.categoryService.findCategoryById(id)),
          );
    const authors =
      !authorIds || authorIds.length === 0
        ? book.authors
        : await Promise.all(
            authorIds.map((id) => this.authorService.findAuthorById(id)),
          );

    Object.assign(book, {
      authors,
      categories,
      ...updateBookDto,
    });

    return this.bookRepository.save(book);
  }

  async softDeleteBook(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: {
        checkouts: {
          fine: true,
        },
      },
    });

    if (!book)
      throw new NotFoundException(
        'Book not found or book has already been marked as deleted.',
      );

    await this.bookRepository.softRemove(book);
  }

  async recoverBook(id: string): Promise<SuccessResponse<BookDto>> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        authors: true,
        checkouts: {
          fine: true,
        },
      },
      withDeleted: true,
    });

    if (!book)
      throw new NotFoundException(
        'Book not found or book has already been recovered.',
      );

    return {
      data: BookDto.convert(await this.bookRepository.recover(book)),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteBooks() {
    const deleteResult = await this.bookRepository
      .createQueryBuilder()
      .delete()
      .where('(CURRENT_TIMESTAMP::date - deletedTimestamp ::date) >= 30')
      .execute();

    this.logger.log(
      `${deleteResult.affected} books have been deleted successfully.`,
    );
  }
}
