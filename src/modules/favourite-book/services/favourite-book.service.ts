import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { BookSearchDto } from '@/modules/book/dto/book-search.dto';
import { BookDto } from '@/modules/book/dto/book.dto';
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

  async getAllFavouriteBooks(
    user: User,
    bookSearchDto: BookSearchDto,
  ): Promise<SuccessResponse<BookDto[]>> {
    return this.bookService.findAll(
      { ...bookSearchDto, filterFavourite: true },
      user,
    );
  }

  async deleteFavouriteBook(user: User, bookId: string) {
    const deletedSuccessfully =
      await this.favouriteBookRepository.deleteByUserIdAndBookId(
        user.id,
        bookId,
      );

    if (!deletedSuccessfully) {
      throw new NotFoundException('Book is not the favourite list.');
    }
  }

  checkHasFavoured(user: User, bookId: string) {
    return this.favouriteBookRepository.isExistedByUserIdAndBookId(
      user.id,
      bookId,
    );
  }
}
