import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Book } from '@/modules/book/entities/book.entity';

@Entity({ schema: 'public', name: 'authors' })
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 100 })
  name: string;

  @Column('integer', { nullable: true })
  yearOfBirth: number;

  @Column('integer', { nullable: true })
  yearOfDeath: number;

  @Column('character varying', { length: 100, nullable: true })
  nationality: string;

  @Column('character varying', { length: 256, nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  biography: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp: Date;

  @ManyToMany(() => Book, (book) => book.authors, {
    cascade: ['remove', 'soft-remove', 'recover'],
  })
  books: Book[];
}
