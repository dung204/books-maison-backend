import { ApiProperty } from '@nestjs/swagger';

import { BookUserDataDto } from '@/modules/book/dto/book-user-data.dto';
import { Book } from '@/modules/book/entities/book.entity';

export class BookDto extends Book {
  @ApiProperty({
    description:
      'Additional data of the current logged in user related to this book',
  })
  userData?: BookUserDataDto;
}
