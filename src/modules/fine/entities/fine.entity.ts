import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The UUID of the fine',
    example: '0d3efe44-b463-505c-b5a3-fb9789bd7f13',
  })
  @PrimaryGeneratedColumn('uuid')
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
}
