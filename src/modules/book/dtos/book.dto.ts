import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { AuthorDto } from '@/modules/author/dtos';
import { BookUserDataDto } from '@/modules/book/dtos';
import { Book } from '@/modules/book/entities';
import { CategoryDto } from '@/modules/category/dtos';

@Exclude()
export class BookDto {
  @ApiProperty({
    description: 'The UUID of the category',
    example: '5070f8e2-6c6e-50d2-a5df-b9a03f2bebf4',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The ISBN-10 or ISBN-13 of the book',
    example: '978-5-9153-5274-1',
  })
  @Expose()
  isbn: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Harry Potter',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The categories of the book',
    type: [CategoryDto],
  })
  @Expose()
  @Transform(({ value }) => value.map(CategoryDto.fromCategory))
  categories: CategoryDto[];

  @ApiProperty({
    description: 'The authors of the book',
    type: [AuthorDto],
  })
  @Expose()
  @Transform(({ value }) => value.map(AuthorDto.fromAuthor))
  authors: AuthorDto[];

  @ApiProperty({
    description: 'The published year of the book',
    example: '1998',
  })
  @Expose()
  publishedYear: number;

  @ApiProperty({
    description: 'The publisher of the book',
    example: 'Dk-Multimedia',
  })
  @Expose()
  publisher: string;

  @ApiProperty({
    description: 'The language of the book',
    example: 'English',
  })
  @Expose()
  language: string;

  @ApiProperty({
    description: 'The number of pages for the book',
    example: '230',
  })
  @Expose()
  numberOfPages: number;

  @ApiProperty({
    description: 'The image URL of the book',
    example: 'http://vikgil.ai/wawhemwat',
  })
  @Expose()
  imageUrl: string;

  @ApiProperty({
    description: 'The description of the book',
    example:
      'cookies score unit dead beautiful was return post source driving people suit mirror heading until pet fine vessels we fallen struck also four knowledge',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'The available quantity in the stock of the book',
    example: '119',
    required: false,
    default: 0,
  })
  @Expose()
  quantity: number;

  @ApiProperty({
    description: 'The timestamp indicating when the book is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Expose()
  createdTimestamp: Date;

  @ApiProperty({
    description:
      'Additional data of the current logged in user related to this book',
  })
  @Expose()
  userData?: BookUserDataDto;

  public static fromBook(book: Book) {
    return plainToInstance(BookDto, book);
  }
}
