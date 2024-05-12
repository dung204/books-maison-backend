import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'The current page number',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive integer' })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items in a page',
    example: 10,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page size must be an integer' })
  @IsPositive({ message: 'Page size must be a positive integer' })
  @IsOptional()
  pageSize?: number = 10;
}