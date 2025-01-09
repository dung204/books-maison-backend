import { ApiProperty } from '@nestjs/swagger';
import {
  IsISBN,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The ISBN-10 or ISBN-13 of the book',
    example: '978-5-9153-5274-1',
    required: false,
  })
  @IsOptional()
  @IsISBN(null, { message: 'ISBN must be a valid ISBN-10 or ISBN-13' })
  isbn?: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Harry Potter',
  })
  @IsNotEmpty()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(256, { message: 'Title must have a maximum length of 256' })
  title: string;

  @ApiProperty({
    description: 'The IDs of categories for the book',
    example: [
      'ae5bd1fb-3cbb-5d3d-acb0-76c3f68bdfbf',
      '4ed3c54a-d64a-5301-a0e8-3a76b06c78bb',
      '63d84670-dafc-5d10-ad37-4847266edebc',
    ],
    required: false,
  })
  @IsOptional()
  @IsUUID(4, {
    each: true,
    message: 'Category IDs must be an array of UUID v4',
  })
  categoryIds?: string[];

  @ApiProperty({
    description: 'The IDs of authors for the book',
    example: [
      '2e891e1d-753a-5a43-a09a-fb8122e0881a',
      '62beb96a-5d98-549d-bc3f-e61da66c113d',
      '5c0f5836-b03a-58e1-b725-20e992513e93',
    ],
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { each: true, message: 'Author IDs must be an array of UUID v4' })
  authorIds?: string[];

  @ApiProperty({
    description: 'The published year of the book',
    example: '1998',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Published year must be an integer' })
  @Min(0)
  publishedYear?: number;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Dk-Multimedia',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Publisher must be a string' })
  @MaxLength(100, { message: 'Publisher must have a maximum length of 100' })
  publisher?: string;

  @ApiProperty({
    description: 'The language of the book',
    example: 'English',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Language must be a string' })
  @MaxLength(100, { message: 'Language must have a maximum length of 100' })
  language?: string;

  @ApiProperty({
    description: 'The number of pages for the book',
    example: '230',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Number of pages must be an integer' })
  @Min(1)
  numberOfPages?: number;

  @ApiProperty({
    description: 'The image URL of the book',
    example: 'http://adwic.gg/wacdodvup',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL invalid' })
  imageUrl?: string;

  @ApiProperty({
    description: 'The description of the book',
    example:
      'chain member whether interior deep broken clear seeing bear anyone lack taught forty direct making many theory map over difficulty his plan luck solve',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'The available quantity in the stock of the book',
    example: '119',
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(0, { message: 'Quantity must greater or equal to 0' })
  quantity?: number;
}
