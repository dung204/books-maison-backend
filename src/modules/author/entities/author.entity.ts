import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'authors' })
export class Author {
  @ApiProperty({
    description: 'The UUID of the author',
    example: 'fa406dbf-8045-5f45-b23e-599d8cf4f2b9',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the author',
    example: 'J.K.Rowling',
  })
  @Column('character varying', { length: 100 })
  name: string;

  @ApiProperty({
    description: 'The birth year of the author',
    example: 1965,
    required: false,
  })
  @Column('integer', { nullable: true })
  yearOfBirth: number;

  @ApiProperty({
    description: 'The death year of the author',
    example: null,
    required: false,
  })
  @Column('integer', { nullable: true })
  yearOfDeath: number;

  @ApiProperty({
    description: 'The nationality of the author',
    example: 'United Kingdom',
    required: false,
  })
  @Column('character varying', { length: 100, nullable: true })
  nationality: string;

  @ApiProperty({
    description: 'The image URL of the author',
    example: 'http://offuv.na/dupat',
    required: false,
  })
  @Column('character varying', { length: 256, nullable: true })
  imageUrl: string;

  @ApiProperty({
    description: 'The biography of the author',
    example:
      'lost medicine worse unhappy recognize largest equal anything point beauty hurried add dry paid orbit knew question animal region route able show task or',
    required: false,
  })
  @Column('text', { nullable: true })
  biography: string;

  @ApiProperty({
    description: 'The timestamp indicating when the author is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;
}
