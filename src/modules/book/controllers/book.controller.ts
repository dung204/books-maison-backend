import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { Admin } from '@/modules/auth/decorators/admin.decorator';
import { OptionalAuth } from '@/modules/auth/decorators/optional-auth.decorator';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { BookDto } from '@/modules/book/dto/book.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { BookService } from '@/modules/book/services/book.service';

import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Admin()
  @ApiOperation({
    summary: 'Create a new book (for ADMIN only)',
  })
  @ApiBody({
    type: CreateBookDto,
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Book,
    isArray: false,
    description: 'Successful book creation',
  })
  @Post('/')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @OptionalAuth()
  @ApiOperation({
    summary: 'Get all books',
    description:
      'This endpoint is public. If a user is signed in, he will know whether a book is in his favourite list, and whether he is borrowing this book',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: BookDto,
    isArray: true,
    pagination: true,
    description:
      'Get all books information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(
    @Request() req: CustomRequest,
    @Query() bookSearchDto: BookSearchDto,
  ) {
    const currentUser = req.user;
    return this.bookService.findAll(bookSearchDto, currentUser);
  }

  @OptionalAuth()
  @ApiOperation({
    summary: 'Get a book by ID',
    description:
      'This endpoint is public. If a user is signed in, he will know whether a book is in his favourite list, and whether he is borrowing this book',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Book,
    isArray: false,
    description: 'Book is retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Book is not found.',
  })
  @Get(':id')
  async findOne(
    @Request() req: CustomRequest,
    @Param('id') id: string,
  ): Promise<SuccessResponse<Book>> {
    const currentUser = req.user;
    return {
      data: await this.bookService.findOne(id, currentUser),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Update a book by ID (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Book,
    isArray: false,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<SuccessResponse<Book>> {
    return {
      data: await this.bookService.update(id, updateBookDto),
    };
  }
}
