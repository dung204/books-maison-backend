import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';

@Entity({ schema: 'public', name: 'fines' })
export class Fine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Checkout, { cascade: true })
  @JoinColumn()
  checkout: Checkout;

  overdueDays: number;

  fineAmount: number;
}
