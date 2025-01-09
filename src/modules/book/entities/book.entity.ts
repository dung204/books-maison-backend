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

import { Author } from '@/modules/author/entities';
import { Category } from '@/modules/category/entities';
import { Checkout } from '@/modules/checkout/entities';

@Entity({ schema: 'public', name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 20, nullable: true })
  isbn: string;

  @Column('character varying', { length: 256 })
  title: string;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Author)
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
