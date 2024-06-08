import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { AuthorService } from '@/modules/author/services/author.service';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { BookRepository } from '@/modules/book/repositories/book.repository';
import { CategoryService } from '@/modules/category/services/category.service';

import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @Inject(BookRepository) private bookRepository: BookRepository,
    private categoryService: CategoryService,
    private authorService: AuthorService,
  ) {}

  async create({
    authorIds,
    categoryIds,
    ...createBookDto
  }: CreateBookDto): Promise<SuccessResponse<Book>> {
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
      data: await this.bookRepository.save(book),
    };
  }

  async findAll(
    bookSearchDto: BookSearchDto,
  ): Promise<SuccessResponse<Book[]>> {
    const { page, pageSize } = bookSearchDto;
    const [books, total] =
      await this.bookRepository.findAllAndCount(bookSearchDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: books,
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

  async findOne(id: string) {
    const book = await this.bookRepository.findById(id);

    if (!book) throw new NotFoundException('Book not found.');

    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    updateBookDto;
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
