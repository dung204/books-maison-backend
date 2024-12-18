import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@/base/common/enum/role.enum';
import { Avatar } from '@/modules/me/entities/avatar.entity';

@Entity({ schema: 'public', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 100, unique: true })
  email: string;

  @Column('character varying', { length: 100 })
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

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;
}
