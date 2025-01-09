import { ApiProperty } from '@nestjs/swagger';

export class BookUserDataDto {
  @ApiProperty({
    description:
      "Indicates whether the book is in the current logged in user's favourite list",
    example: true,
  })
  isFavouring: boolean;

  @ApiProperty({
    description:
      'Indicates whether the book is being borrowed by the current logged in user (i.e. the user have a `BORROWING` checkout of this book)',
  })
  isBorrowing: boolean;
}
