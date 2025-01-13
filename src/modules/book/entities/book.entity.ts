import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { IdGeneratedEntity } from '@/base/common/entities';
import { Author } from '@/modules/author/entities';
import { Category } from '@/modules/category/entities';
import { Checkout } from '@/modules/checkout/entities';

@Entity({ schema: 'public', name: 'books' })
export class Book extends IdGeneratedEntity {
  @Column('character varying', { length: 20, nullable: true })
  isbn!: string | null;

  @Column('character varying', { length: 256 })
  title!: string;

  @ManyToMany(() => Category)
  @JoinTable()
  categories!: Category[];

  @ManyToMany(() => Author)
  @JoinTable()
  authors!: Author[];

  @Column('integer', { nullable: true })
  publishedYear!: number | null;

  @Column('character varying', { length: 100, nullable: true })
  publisher!: string | null;

  @Column('character varying', { length: 100, nullable: true })
  language!: string | null;

  @Column('integer', { nullable: true })
  numberOfPages!: number | null;

  @Column('character varying', { length: 256, nullable: true })
  imageUrl!: string | null;

  @Column('text', { nullable: true })
  description!: string | null;

  @Column('integer', { default: 0 })
  quantity!: number;

  @OneToMany(() => Checkout, (checkout) => checkout.book, {
    cascade: ['soft-remove', 'remove', 'recover'],
  })
  checkouts!: Checkout[];
}
