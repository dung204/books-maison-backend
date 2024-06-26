import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserCreateCheckoutDto {
  @ApiProperty({
    description: 'The UUID of the book to be included in the checkout',
    example: 'fa8002b0-2dc2-5fd2-840f-362798cd2415',
  })
  @IsNotEmpty()
  @IsUUID(4, { message: 'Book ID must be a valid UUID v4' })
  bookId: string;
}
