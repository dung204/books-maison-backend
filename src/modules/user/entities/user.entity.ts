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

import { Role } from '@/base/common/enum';
import { Checkout } from '@/modules/checkout/entities';
import { Avatar } from '@/modules/me/entities';
import { Transaction } from '@/modules/transaction/entities';

@Entity({ schema: 'public', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { length: 100, unique: true })
  email!: string;

  @Column('character varying', { length: 100, nullable: true })
  password!: string | null;

  @Column('character varying', { length: 100 })
  firstName!: string;

  @Column('character varying', { length: 100 })
  lastName!: string;

  @Column('character varying', { length: 256, nullable: true })
  address!: string;

  @OneToOne(() => Avatar, {
    cascade: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar!: Avatar | null;

  @Column('enum', { enum: Role, default: Role.USER })
  role!: Role;

  @Column('character varying', { nullable: true })
  googleId!: string | null;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp!: Date | null;

  @OneToMany(() => Checkout, (checkout) => checkout.user, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  checkouts!: Checkout[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  transactions!: Transaction[];
}
