import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'authors' })
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('character varying', { length: 100 })
  name!: string;

  @Column('integer', { nullable: true })
  yearOfBirth!: number | null;

  @Column('integer', { nullable: true })
  yearOfDeath!: number | null;

  @Column('character varying', { length: 100, nullable: true })
  nationality!: string | null;

  @Column('character varying', { length: 256, nullable: true })
  imageUrl!: string | null;

  @Column('text', { nullable: true })
  biography!: string | null;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedTimestamp!: Date | null;
}
