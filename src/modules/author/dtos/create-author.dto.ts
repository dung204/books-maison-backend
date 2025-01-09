import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    description: 'The name of the author',
    example: 'J.K.Rowling',
  })
  @IsNotEmpty({ message: 'Author name must not be empty.' })
  @IsString({ message: 'Author name must be a string.' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'The birth year of the author',
    example: 1965,
    required: false,
  })
  @IsPositive({ message: 'Year of birth must be a positive number' })
  @IsOptional()
  yearOfBirth?: number;

  @ApiProperty({
    description: 'The death year of the author',
    example: null,
    required: false,
  })
  @IsPositive({ message: 'Year of death must be a positive number' })
  @IsOptional()
  yearOfDeath?: number;

  @ApiProperty({
    description: 'The nationality of the author',
    example: 'United Kingdom',
    required: false,
  })
  @IsString({ message: 'Nationality must be a string' })
  @IsOptional()
  nationality?: string;

  @ApiProperty({
    description: 'The image URL of the author',
    example: 'http://offuv.na/dupat',
    required: false,
  })
  @IsUrl({}, { message: 'Image URL not valid.' })
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'The biography of the author',
    example:
      'lost medicine worse unhappy recognize largest equal anything point beauty hurried add dry paid orbit knew question animal region route able show task or',
    required: false,
  })
  @IsString({ message: 'Biography must be a string' })
  @IsOptional()
  biography?: string;
}
