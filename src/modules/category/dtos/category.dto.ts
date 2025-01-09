import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Category } from '@/modules/category/entities';

@Exclude()
export class CategoryDto {
  @ApiProperty({
    description: 'The UUID of the category',
    example: '4309dc9f-07a9-5945-8063-d001cc7010fc',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Action/Adventure',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'The timestamp indicating when the category is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Expose()
  createdTimestamp!: Date;

  public static fromCategory(category: Category) {
    return plainToInstance(CategoryDto, category);
  }
}
