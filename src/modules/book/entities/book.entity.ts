import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The UUID of the category',
    example: '5070f8e2-6c6e-50d2-a5df-b9a03f2bebf4',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The ISBN-10 or ISBN-13 of the book',
    example: '978-5-9153-5274-1',
  })
  @Column('character varying', { length: 20, nullable: true })
  isbn: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Harry Potter',
  })
  @Column('character varying', { length: 256 })
  title: string;

  @ApiProperty({
    description: 'The categories of the book',
    type: [Category],
  })
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ApiProperty({
    description: 'The authors of the book',
    type: [Author],
  })
  @ManyToMany(() => Author)
  @JoinTable()
  authors: Author[];

  @ApiProperty({
    description: 'The published year of the book',
    example: '1998',
  })
  @Column('integer', { nullable: true })
  publishedYear: number;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Dk-Multimedia',
  })
  @Column('character varying', { length: 100, nullable: true })
  publisher: string;

  @ApiProperty({
    description: 'The language of the book',
    example: 'English',
  })
  @Column('character varying', { length: 100, nullable: true })
  language: string;

  @ApiProperty({
    description: 'The number of pages for the book',
    example: '230',
  })
  @Column('integer', { nullable: true })
  numberOfPages: number;

  @ApiProperty({
    description: 'The image URL of the book',
    example: 'http://vikgil.ai/wawhemwat',
  })
  @Column('character varying', { length: 256, nullable: true })
  imageUrl: string;

  @ApiProperty({
    description: 'The description of the book',
    example:
      'cookies score unit dead beautiful was return post source driving people suit mirror heading until pet fine vessels we fallen struck also four knowledge',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    description: 'The available quantity in the stock of the book',
    example: '119',
    required: false,
    default: 0,
  })
  @Column('integer', { default: 0 })
  quantity: number;

  @ApiProperty({
    description: 'The timestamp indicating when the book is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;
}
