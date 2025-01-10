import { Column, Entity, ManyToOne } from 'typeorm';

import { IdNonGeneratedEntity } from '@/base/common/entities';
import { TransactionMethod } from '@/modules/transaction/enums';
import { User } from '@/modules/user/entities';

@Entity({ schema: 'public', name: 'transactions' })
export class Transaction extends IdNonGeneratedEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column('integer')
  amount!: number;

  @Column({
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  method!: TransactionMethod;
}
