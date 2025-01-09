import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Checkout } from '@/modules/checkout/entities';
import { FineStatus } from '@/modules/fine/enums';
import { Transaction } from '@/modules/transaction/entities';

@Entity({ schema: 'public', name: 'fines' })
export class Fine {
  @PrimaryColumn('character varying')
  id!: string;

  @OneToOne(() => Checkout, { onDelete: 'CASCADE' })
  @JoinColumn()
  checkout!: Checkout;

  @Column({ enum: FineStatus, default: FineStatus.ISSUED })
  status!: FineStatus;

  @OneToOne(() => Transaction)
  @JoinColumn()
  transaction!: Transaction | null;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp!: Date | null;
}
