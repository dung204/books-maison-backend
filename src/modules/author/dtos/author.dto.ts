import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Author } from '@/modules/author/entities';

@Exclude()
export class AuthorDto {
  @ApiProperty({
    description: 'The UUID of the author',
    example: 'fa406dbf-8045-5f45-b23e-599d8cf4f2b9',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the author',
    example: 'J.K.Rowling',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'The birth year of the author',
    example: 1965,
    required: false,
  })
  @Expose()
  yearOfBirth: number;

  @ApiProperty({
    description: 'The death year of the author',
    example: null,
    required: false,
  })
  @Expose()
  yearOfDeath: number;

  @ApiProperty({
    description: 'The nationality of the author',
    example: 'United Kingdom',
    required: false,
  })
  @Expose()
  nationality: string;

  @ApiProperty({
    description: 'The image URL of the author',
    example: 'http://offuv.na/dupat',
    required: false,
  })
  @Expose()
  imageUrl: string;

  @ApiProperty({
    description: 'The biography of the author',
    example:
      'lost medicine worse unhappy recognize largest equal anything point beauty hurried add dry paid orbit knew question animal region route able show task or',
    required: false,
  })
  @Expose()
  biography: string;

  @ApiProperty({
    description: 'The timestamp indicating when the author is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Expose()
  createdTimestamp: Date;

  public static fromAuthor(author: Author): AuthorDto {
    return plainToInstance(AuthorDto, author);
  }
}
