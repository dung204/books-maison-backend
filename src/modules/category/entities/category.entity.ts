import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'categories' })
export class Category {
  @ApiProperty({
    description: 'The UUID of the category',
    example: '4309dc9f-07a9-5945-8063-d001cc7010fc',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Action/Adventure',
  })
  @Column('character varying', { length: 100, nullable: false })
  name: string;

  @ApiProperty({
    description: 'The timestamp indicating when the category is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;
}
