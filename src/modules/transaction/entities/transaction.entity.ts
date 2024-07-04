import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'transactions' })
export class Transaction {
  @ApiProperty({
    description: 'The ID of the transaction',
    example: 'af119453-910b-5d5a-9c21-706cb677539d',
  })
  @PrimaryGeneratedColumn('uuid')
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
  @Column('money')
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
  paymentMethod: TransactionMethod;

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
