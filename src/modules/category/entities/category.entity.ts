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
}
