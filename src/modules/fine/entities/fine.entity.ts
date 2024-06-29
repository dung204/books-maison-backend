import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';

@Entity({ schema: 'public', name: 'fines' })
export class Fine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Checkout)
  @JoinColumn()
  checkout: Checkout;

  @Column({ enum: FineStatus, default: FineStatus.ISSUED })
  status: FineStatus;
}
