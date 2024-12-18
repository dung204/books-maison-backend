import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'avatars' })
export class Avatar {
  @PrimaryColumn('character varying')
  id: string;

  @OneToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column('decimal')
  offsetX: number;

  @Column('decimal')
  offsetY: number;

  @Column('decimal')
  zoom: number;
}
