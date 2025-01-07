import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { BookDto } from '@/modules/book/dto/book.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutStatus } from '@/modules/checkout/enums/checkout-status.enum';
import { UserDto } from '@/modules/user/dto/user.dto';

@Exclude()
export class CheckoutDto {
  @ApiProperty({
    description: 'The ID of the checkout (format: `BM_CH_${Date.now()}`)',
    example: 'BM_CH_1722579024486',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The user who performs the checkout',
    type: UserDto,
  })
  @Expose()
  @Transform(({ value }) => UserDto.fromUser(value))
  user: UserDto;

  @ApiProperty({
    description: 'The book checked out by the user',
    type: BookDto,
  })
  @Expose()
  @Transform(({ value }) => BookDto.fromBook(value))
  book: BookDto;

  @ApiProperty({
    description: 'The status of the checkout',
    enum: CheckoutStatus,
    enumName: 'CheckoutStatus',
  })
  @Expose()
  status: CheckoutStatus;

  @ApiProperty({
    description: 'The timestamp indicating when the checkout is created',
    example: '2024-06-24T16:34:45.109Z',
  })
  @Expose()
  createdTimestamp: Date;

  @ApiProperty({
    description:
      'The timestamp indicating when the book is due to be returned (14 days after the checkout is created)',
    example: '2024-07-08T16:34:45.109Z',
  })
  @Expose()
  dueTimestamp: Date;

  @ApiProperty({
    description: 'The timestamp indicating when the user returned the book',
    example: '2024-07-10T16:34:45.109Z',
    required: false,
    nullable: false,
  })
  @Expose()
  returnedTimestamp?: Date;

  @ApiProperty({
    description: 'Additional note for the checkout',
    required: false,
    nullable: true,
  })
  @Expose()
  note?: string;

  public static fromCheckout(checkout: Checkout) {
    return plainToInstance(CheckoutDto, checkout);
  }
}
