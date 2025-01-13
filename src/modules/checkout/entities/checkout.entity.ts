import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { IdNonGeneratedEntity } from '@/base/common/entities';
import { Book } from '@/modules/book/entities';
import { CheckoutStatus } from '@/modules/checkout/enums';
import { Fine } from '@/modules/fine/entities';
import { User } from '@/modules/user/entities';

@Entity({ schema: 'public', name: 'checkouts' })
export class Checkout extends IdNonGeneratedEntity {
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Book)
  book!: Book;

  @Column('enum', { enum: CheckoutStatus, default: CheckoutStatus.BORROWING })
  status!: CheckoutStatus;

  @Column('timestamp with time zone')
  dueTimestamp!: Date;

  @Column('timestamp with time zone', { nullable: true })
  returnedTimestamp!: Date | null;

  @Column('text', { nullable: true })
  note?: string;

  @OneToOne(() => Fine, (fine) => fine.checkout, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  fine!: Fine;
}
