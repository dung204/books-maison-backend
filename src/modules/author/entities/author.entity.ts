import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
