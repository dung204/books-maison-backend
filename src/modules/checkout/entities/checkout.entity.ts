import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Book } from '@/modules/book/entities';
import { CheckoutStatus } from '@/modules/checkout/enums';
import { Fine } from '@/modules/fine/entities';
import { User } from '@/modules/user/entities';

@Entity({ schema: 'public', name: 'checkouts' })
export class Checkout {
  @PrimaryColumn('character varying')
  id!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Book)
  book!: Book;

  @Column('enum', { enum: CheckoutStatus, default: CheckoutStatus.BORROWING })
  status!: CheckoutStatus;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp!: Date;

  @Column('timestamp with time zone')
  dueTimestamp!: Date;

  @Column('timestamp with time zone', { nullable: true })
  returnedTimestamp!: Date | null;

  @Column('text', { nullable: true })
  note?: string;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp!: Date | null;

  @OneToOne(() => Fine, (fine) => fine.checkout, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  fine!: Fine;
}
