import { Controller } from '@nestjs/common';

import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';

@Controller('favourite-book')
export class FavouriteBookController {
  constructor(private readonly favouriteBookService: FavouriteBookService) {}

  // @UseGuards(JwtAccessGuard)
  // @Post('/add/:id')
  // addFavouriteBook(@Request() req: CustomRequest, @Param('id') bookId: string) {
  //   const currentUser = req.user;
  //   this.favouriteBookService.addFavouriteBook(currentUser, bookId);
  // }
}
