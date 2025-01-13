import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { IdNonGeneratedEntity } from '@/base/common/entities';
import { Checkout } from '@/modules/checkout/entities';
import { FineStatus } from '@/modules/fine/enums';
import { Transaction } from '@/modules/transaction/entities';

@Entity({ schema: 'public', name: 'fines' })
export class Fine extends IdNonGeneratedEntity {
  @OneToOne(() => Checkout, { onDelete: 'CASCADE' })
  @JoinColumn()
  checkout!: Checkout;

  @Column({ enum: FineStatus, default: FineStatus.ISSUED })
  status!: FineStatus;

  @OneToOne(() => Transaction)
  @JoinColumn()
  transaction!: Transaction | null;
}
