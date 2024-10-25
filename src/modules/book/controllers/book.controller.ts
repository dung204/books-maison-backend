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
} from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Admin } from '@/base/common/decorators/admin.decorator';
import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { Public } from '@/base/common/decorators/public.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
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

  @Public()
  @ApiOperation({
    summary: 'Get all books',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Book,
    isArray: true,
    pagination: true,
    description:
      'Get all books information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() bookSearchDto: BookSearchDto) {
    return this.bookService.findAll(bookSearchDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get a book by ID',
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
  async findOne(@Param('id') id: string): Promise<SuccessResponse<Book>> {
    return {
      data: await this.bookService.findOne(id),
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
