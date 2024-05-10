import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CheckoutStatus } from '@/base/common/enum/checkout-status.enum';
import { Book } from '@/modules/book/entities/book.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'checkouts' })
export class Checkout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Book)
  book: Book;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  checkoutTimestamp: Date;

  @Column('timestamp with time zone')
  dueTimestamp: Date;

  @Column('enum', { enum: CheckoutStatus })
  status: CheckoutStatus;
}
