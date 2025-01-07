import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@/base/common/enum/role.enum';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { Avatar } from '@/modules/me/entities/avatar.entity';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';

@Entity({ schema: 'public', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 100, unique: true })
  email: string;

  @Column('character varying', { length: 100, nullable: true })
  password: string;

  @Column('character varying', { length: 100 })
  firstName: string;

  @Column('character varying', { length: 100 })
  lastName: string;

  @Column('character varying', { length: 256, nullable: true })
  address: string;

  @OneToOne(() => Avatar, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: Avatar;

  @Column('enum', { enum: Role, default: Role.USER })
  role: Role;

  @Column('character varying', { nullable: true })
  googleId: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp: Date;

  @OneToMany(() => Checkout, (checkout) => checkout.user, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  checkouts: Checkout[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  transactions: Transaction[];
}
