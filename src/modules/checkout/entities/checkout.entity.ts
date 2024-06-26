import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CheckoutStatus } from '@/base/common/enum/checkout-status.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'checkouts' })
export class Checkout {
  @ApiProperty({
    description: 'The UUID of the checkout',
    example: 'da2b45e0-4fa5-5aa3-a5a8-a2783c888691',
  })
  @PrimaryGeneratedColumn('uuid')
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
    description: 'The timestamp indicating when the checkout is created',
    example: '2024-06-24T16:34:45.109Z',
  })
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  checkoutTimestamp: Date;

  @ApiProperty({
    description:
      'The timestamp indicating when the book is due to be returned (14 days after the checkout is created)',
    example: '2024-07-08T16:34:45.109Z',
  })
  @Column('timestamp with time zone')
  dueTimestamp: Date;

  @ApiProperty({
    description: 'The status of the checkout',
    enum: CheckoutStatus,
    enumName: 'CheckoutStatus',
  })
  @Column('enum', { enum: CheckoutStatus, default: CheckoutStatus.RENTING })
  status: CheckoutStatus;

  @ApiProperty({
    description: 'Additional note for the checkout',
    required: false,
    nullable: true,
  })
  @Column('text', { nullable: true })
  note?: string;
}
