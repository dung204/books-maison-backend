import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Private } from '@/base/common/decorators/private.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@ApiTags('favourite-books')
@Controller('favourite-books')
export class FavouriteBookController {
  constructor(private readonly favouriteBookService: FavouriteBookService) {}

  @Private()
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
  @ApiNotFoundResponse({
    description: 'Book not found.',
  })
  @Post('/add/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  addFavouriteBook(@Request() req: CustomRequest, @Param('id') bookId: string) {
    const currentUser = req.user;
    return this.favouriteBookService.addFavouriteBook(currentUser, bookId);
  }

  @Private()
  @ApiOperation({
    summary: 'Delete a favourite book',
    description:
      'Delete a book from favourite list of the current authenticated user',
  })
  @ApiNoContentResponse({
    description: 'Favourite book added successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Book not found in the favourite list.',
  })
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteFavouriteBook(
    @Request() req: CustomRequest,
    @Param('id') bookId: string,
  ) {
    const currentUser = req.user;
    return this.favouriteBookService.deleteFavouriteBook(currentUser, bookId);
  }

  @Private()
  @ApiOperation({
    summary: 'Check if a book already added in the current user favourite list',
  })
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
