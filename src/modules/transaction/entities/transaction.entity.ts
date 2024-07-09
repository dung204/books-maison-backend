import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'transactions' })
export class Transaction {
  @PrimaryColumn('character varying')
  id: string;

  @ManyToOne(() => User)
  user: UserDto;

  @Column('integer')
  amount: number;

  @Column({
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  transactionMethod: TransactionMethod;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdTimestamp: Date;
}
