import { Inject, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { AuthorService } from '@/modules/author/services/author.service';
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
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<Book[]>> {
    const { page, pageSize } = paginationQueryDto;
    const skip = (page - 1) * pageSize;
    const [books, total] = await this.bookRepository.findAndCount({
      skip,
      take: pageSize,
      relations: ['authors', 'categories'],
    });
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

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    updateBookDto;
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
