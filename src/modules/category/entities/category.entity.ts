import { Column, Entity } from 'typeorm';

import { IdGeneratedEntity } from '@/base/common/entities';

@Entity({ schema: 'public', name: 'categories' })
export class Category extends IdGeneratedEntity {
  @Column('character varying', { length: 100, nullable: false })
  name!: string;
}
