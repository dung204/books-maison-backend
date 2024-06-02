import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Author } from '@/modules/author/entities/author.entity';
import { Category } from '@/modules/category/entities/category.entity';

@Entity({ schema: 'public', name: 'books' })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 20, nullable: true })
  isbn: string;

  @Column('character varying', { length: 256, nullable: true })
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

  @Column('integer')
  quantity: number;
}
