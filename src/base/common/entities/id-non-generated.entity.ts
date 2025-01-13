import { CreateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';

export abstract class IdNonGeneratedEntity {
  @PrimaryColumn('character varying')
  id!: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdTimestamp!: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedTimestamp!: Date | null;
}
