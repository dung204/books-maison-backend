import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';

export class BookSearchDto extends PaginationQueryDto {
  @ApiProperty({
    description: `Every books with at least one author's name containing this name will be returned`,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Author name must be a string' })
  authorName?: string;

  @ApiProperty({
    description:
      'Every books containing at least one of these categories will be returned',
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsOptional()
  @IsUUID(4, {
    each: true,
    message: 'Category IDs must be an array of UUID v4',
  })
  categoryId?: string[];
}
