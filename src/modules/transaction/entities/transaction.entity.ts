import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { TransactionMethod } from '@/modules/transaction/enums';
import { User } from '@/modules/user/entities';

@Entity({ schema: 'public', name: 'transactions' })
export class Transaction {
  @PrimaryColumn('character varying')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column('integer')
  amount: number;

  @Column({
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  method: TransactionMethod;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp: Date;
}
