import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { BookService } from '@/modules/book/services/book.service';
import { FavouriteBook } from '@/modules/favourite-book/entities/favourite-book.entity';
import { FavouriteBookRepository } from '@/modules/favourite-book/repositories/favourite-book.repository';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class FavouriteBookService {
  constructor(
    @Inject(FavouriteBookRepository)
    private readonly favouriteBookRepository: FavouriteBookRepository,
    private readonly bookService: BookService,
  ) {}

  async addFavouriteBook(user: User, bookId: string) {
    const hasExistedByUserIdAndBookId =
      await this.favouriteBookRepository.isExistedByUserIdAndBookId(
        user.id,
        bookId,
      );

    if (hasExistedByUserIdAndBookId) {
      throw new ConflictException(
        'User has already added this book as favourite book.',
      );
    }

    const book = await this.bookService.findOne(bookId);
    const favouriteBook = new FavouriteBook();

    favouriteBook.userId = user.id;
    favouriteBook.bookId = book.id;

    favouriteBook.user = user;
    favouriteBook.book = book;

    await this.favouriteBookRepository.save(favouriteBook);
  }
}
