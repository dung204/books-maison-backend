import { Column, Entity } from 'typeorm';

import { IdGeneratedEntity } from '@/base/common/entities';

@Entity({ schema: 'public', name: 'authors' })
export class Author extends IdGeneratedEntity {
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
}
