import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Book } from '@/modules/book/entities/book.entity';
import { CheckoutStatus } from '@/modules/checkout/enums/checkout-status.enum';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'checkouts' })
export class Checkout {
  @ApiProperty({
    description: 'The ID of the checkout (format: `BM_CH_${Date.now()}`)',
    example: 'BM_CH_1722579024486',
  })
  @PrimaryColumn('character varying')
  id: string;

  @ApiProperty({
    description: 'The user who performs the checkout',
    type: UserDto,
  })
  @ManyToOne(() => User)
  user: UserDto;

  @ApiProperty({
    description: 'The book checked out by the user',
    type: Book,
  })
  @ManyToOne(() => Book)
  book: Book;

  @ApiProperty({
    description: 'The status of the checkout',
    enum: CheckoutStatus,
    enumName: 'CheckoutStatus',
  })
  @Column('enum', { enum: CheckoutStatus, default: CheckoutStatus.BORROWING })
  status: CheckoutStatus;

  @ApiProperty({
    description: 'The timestamp indicating when the checkout is created',
    example: '2024-06-24T16:34:45.109Z',
  })
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdTimestamp: Date;

  @ApiProperty({
    description:
      'The timestamp indicating when the book is due to be returned (14 days after the checkout is created)',
    example: '2024-07-08T16:34:45.109Z',
  })
  @Column('timestamp with time zone')
  dueTimestamp: Date;

  @ApiProperty({
    description: 'The timestamp indicating when the user returned the book',
    example: '2024-07-10T16:34:45.109Z',
    required: false,
    nullable: false,
  })
  @Column('timestamp with time zone', { nullable: true })
  returnedTimestamp?: Date;

  @ApiProperty({
    description: 'Additional note for the checkout',
    required: false,
    nullable: true,
  })
  @Column('text', { nullable: true })
  note?: string;
}
