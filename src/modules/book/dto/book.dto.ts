import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Book } from '@/modules/book/entities/book.entity';

@Exclude()
export class BookDto extends Book {
  @Expose()
  @ApiProperty({
    description: 'Indicating that the current user is favouring this book',
    example: true,
    default: false,
  })
  isFavouring: boolean;

  public static fromBook(book: Book) {
    return plainToInstance(BookDto, book);
  }
}
