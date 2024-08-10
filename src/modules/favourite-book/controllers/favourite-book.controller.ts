import {
  Controller,
  Delete,
  Get,
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

import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@ApiBearerAuth('JWT')
@ApiTags('favourite-books')
@Controller('favourite-books')
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
    summary: 'Delete a favourite book',
    description:
      'Delete a book from favourite list of the current authenticated user',
  })
  @ApiUnauthorizedResponse({
    description: 'User has not signed in.',
  })
  @ApiNoContentResponse({
    description: 'Favourite book added successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Book not found in the favourite list.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavouriteBook(
    @Request() req: CustomRequest,
    @Param('id') bookId: string,
  ) {
    const currentUser = req.user;
    return this.favouriteBookService.deleteFavouriteBook(currentUser, bookId);
  }

  @ApiOperation({
    summary: 'Check if a book already added in the current user favourite list',
  })
  @ApiUnauthorizedResponse({
    description: 'User has not signed in.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get('/check/:id')
  async checkHasFavoured(
    @Request() req: CustomRequest,
    @Param('id') bookId: string,
  ): Promise<SuccessResponse<boolean>> {
    const currentUser = req.user;
    return {
      data: await this.favouriteBookService.checkHasFavoured(
        currentUser,
        bookId,
      ),
    };
  }
}
