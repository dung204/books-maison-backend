import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@/base/common/enum/role.enum';
import { Book } from '@/modules/book/entities/book.entity';

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

  @Column('enum', { enum: Role, default: Role.USER })
  role: Role;

  @ManyToMany(() => Book)
  @JoinTable({ name: 'user_favourite_books' })
  favouriteBooks: Book[];

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;
}
