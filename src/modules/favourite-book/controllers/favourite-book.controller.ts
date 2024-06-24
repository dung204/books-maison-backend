import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Book } from '@/modules/book/entities/book.entity';
import { FavouriteBookSearchDto } from '@/modules/favourite-book/dto/favourite-book-search.dto';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@ApiBearerAuth('JWT')
@ApiTags('favourite-books')
@Controller('favourite-book')
export class FavouriteBookController {
  constructor(private readonly favouriteBookService: FavouriteBookService) {}

  @ApiOperation({
    summary: 'Add a favourite book',
    description:
      'Add a book as a favourite book to the current authenticated user',
  })
  @ApiNoContentResponse({
    description: 'Favourite book added successfully.',
  })
  @ApiConflictResponse({
    description: 'User has already added this book as favourite book.',
  })
  @ApiUnauthorizedResponse({
    description: 'User has not signed in.',
  })
  @ApiNotFoundResponse({
    description: 'Book not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Post('/add/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  addFavouriteBook(@Request() req: CustomRequest, @Param('id') bookId: string) {
    const currentUser = req.user;
    return this.favouriteBookService.addFavouriteBook(currentUser, bookId);
  }

  @ApiOperation({
    summary: 'Get all favourite books',
    description: 'Get all favourite books of the current authenticated user',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Book,
    isArray: true,
    pagination: true,
    description:
      'Get all favourite books information successfully (with pagination metadata)',
  })
  @ApiUnauthorizedResponse({
    description: 'User has not signed in.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get('/all')
  getAllFavouriteBooks(
    @Request() req: CustomRequest,
    @Query() favouriteBookSearchDto: FavouriteBookSearchDto,
  ) {
    const currentUser = req.user;
    return this.favouriteBookService.getAllFavouriteBooks(
      currentUser,
      favouriteBookSearchDto,
    );
  }
}
