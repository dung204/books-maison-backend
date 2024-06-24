import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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

import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
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
}
