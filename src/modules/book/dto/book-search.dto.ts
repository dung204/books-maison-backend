import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { BookOrderableField } from '@/modules/book/enums/book-orderable-field.enum';

export class BookSearchDto extends OmitType(PaginationQueryDto, ['orderBy']) {
  @ApiProperty({
    description: 'The field to order the books by',
    enum: BookOrderableField,
    enumName: 'BookOrderableFields',
    default: BookOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: BookOrderableField = BookOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description:
      'Every books with title containing this title will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({
    description:
      'Every books with publisher containing this name will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Publisher must be a string' })
  publisher?: string;

  @ApiProperty({
    description: 'Every books published after this year will be returned',
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Published year from must be an integer' })
  @IsPositive({ message: 'Published year from must be a positive integer' })
  @IsOptional()
  publishedYearFrom?: number;

  @ApiProperty({
    description: 'Every books published before this year will be returned',
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Published year to must be an integer' })
  @IsPositive({ message: 'Published year to must be a positive integer' })
  @IsOptional()
  publishedYearTo?: number;

  @ApiProperty({
    description: 'Minimum number of pages in the books to be returned',
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Minimum number of pages to must be an integer' })
  @IsPositive({
    message: 'Minimum number of pages to must be a positive integer',
  })
  @IsOptional()
  minPages?: number;

  @ApiProperty({
    description: 'Maximum number of pages in the books to be returned',
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Maximum number of pages to must be an integer' })
  @IsPositive({
    message: 'Maximum number of pages to must be a positive integer',
  })
  @IsOptional()
  maxPages?: number;

  @ApiProperty({
    description:
      'Every books containing at least one of these languages will be returned',
    required: false,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  @IsOptional()
  @IsString({
    each: true,
    message: 'Languages must be an array of string',
  })
  language?: string[];

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
