import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';

@Entity({ schema: 'public', name: 'fines' })
export class Fine {
  @ApiProperty({
    description: 'The ID of the fine (format: `BM_FI_${Date.now()}`)',
    example: 'BM_FI_1722579577171',
  })
  @PrimaryColumn('character varying')
  id: string;

  @ApiProperty({
    description: 'The corresponding checkout of the fine',
    type: Checkout,
  })
  @OneToOne(() => Checkout)
  @JoinColumn()
  checkout: Checkout;

  @ApiProperty({
    description: 'The status of the fine',
    enum: FineStatus,
    enumName: 'FineStatus',
    default: FineStatus.ISSUED,
  })
  @Column({ enum: FineStatus, default: FineStatus.ISSUED })
  status: FineStatus;

  @ApiProperty({
    description: 'The corresponding transaction of the fine',
    type: Transaction,
    nullable: true,
  })
  @OneToOne(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @ApiProperty({
    description: 'The created timestamp of the fine',
    example: '2024-06-30T13:46:54.405Z',
  })
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdTimestamp: Date;
}
