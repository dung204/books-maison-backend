import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Author } from '@/modules/author/entities/author.entity';
import { Category } from '@/modules/category/entities/category.entity';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';

@Entity({ schema: 'public', name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 20, nullable: true })
  isbn: string;

  @Column('character varying', { length: 256 })
  title: string;

  @ManyToMany(() => Category, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Author, { onDelete: 'CASCADE' })
  @JoinTable()
  authors: Author[];

  @Column('integer', { nullable: true })
  publishedYear: number;

  @Column('character varying', { length: 100, nullable: true })
  publisher: string;

  @Column('character varying', { length: 100, nullable: true })
  language: string;

  @Column('integer', { nullable: true })
  numberOfPages: number;

  @Column('character varying', { length: 256, nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('integer', { default: 0 })
  quantity: number;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp: Date;

  @OneToMany(() => Checkout, (checkout) => checkout.book, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  checkouts: Checkout[];
}
