import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'transactions' })
export class Transaction {
  @ApiProperty({
    description: 'The ID of the transaction (format: `BM_TR_${Date.now()}`)',
    example: 'BM_TR_1722578983111',
  })
  @PrimaryColumn('character varying')
  id: string;

  @ApiProperty({
    description: 'The user who performs the transaction',
    type: UserDto,
  })
  @ManyToOne(() => User)
  user: UserDto;

  @ApiProperty({
    description: 'The money amount of the transaction',
    example: 100_000,
  })
  @Column('integer')
  amount: number;

  @ApiProperty({
    description: 'The method that the transaction is performed',
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  @Column({
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  method: TransactionMethod;

  @ApiProperty({
    description: 'The created timestamp of the transaction',
    example: '2024-07-04T06:10:02.679Z',
  })
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdTimestamp: Date;
}
