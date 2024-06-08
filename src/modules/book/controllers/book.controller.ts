import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { Book } from '@/modules/book/entities/book.entity';
import { BookService } from '@/modules/book/services/book.service';

import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@ApiTags('books')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiBearerAuth('JWT')
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
  @ApiUnauthorizedResponse({
    description: 'User login is required',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Post('/')
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get('/')
  findAll(@Query() bookSearchDto: BookSearchDto) {
    return this.bookService.findAll(bookSearchDto);
  }

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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
