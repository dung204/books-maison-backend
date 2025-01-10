import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

import { SQLNullableTransform } from '@/base/common/decorators';
import { SQLNullable } from '@/base/common/types';
import { StringUtils } from '@/base/utils';

export class UpdateAuthorDto {
  @ApiProperty({
    description:
      'The name of the author (use `NULL` string if updating to null)',
    example: 'J.K.Rowling',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Author name must be a string.' })
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description:
      'The birth year of the author (use `NULL` string if updating to null)',
    example: '1965',
    required: false,
    type: String,
  })
  @SQLNullableTransform(({ value }) => parseInt(value, 10))
  @IsPositive({ message: 'Year of birth must be a positive number' })
  @IsOptional()
  yearOfBirth?: SQLNullable<number>;

  @ApiProperty({
    description:
      'The death year of the author (use `NULL` string if updating to null)',
    example: StringUtils.SQL_NULL,
    required: false,
    type: String,
  })
  @SQLNullableTransform(({ value }) => parseInt(value, 10))
  @IsPositive({ message: 'Year of death must be a positive number' })
  @IsOptional()
  yearOfDeath?: SQLNullable<number>;

  @ApiProperty({
    description:
      'The nationality of the author (use `NULL` string if updating to null)',
    example: 'United Kingdom',
    required: false,
  })
  @SQLNullableTransform()
  @IsString({ message: 'Nationality must be a string' })
  @IsOptional()
  nationality?: SQLNullable<string>;

  @ApiProperty({
    description:
      'The image URL of the author (use `NULL` string if updating to null)',
    example: 'http://offuv.na/dupat',
    required: false,
  })
  @SQLNullableTransform()
  @IsUrl({}, { message: 'Image URL not valid.' })
  @IsOptional()
  imageUrl?: SQLNullable<string>;

  @ApiProperty({
    description:
      'The biography of the author (use `NULL` string if updating to null)',
    example:
      'lost medicine worse unhappy recognize largest equal anything point beauty hurried add dry paid orbit knew question animal region route able show task or',
    required: false,
  })
  @SQLNullableTransform()
  @IsString({ message: 'Biography must be a string' })
  @IsOptional()
  biography?: SQLNullable<string>;
}
