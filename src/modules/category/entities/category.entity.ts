import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { length: 100 })
  name: string;
}
