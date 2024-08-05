import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { AuthorOrderableFields } from '@/modules/author/enum/author-orderable-fields.enum';

export class AuthorSearchDto extends OmitType(PaginationQueryDto, ['orderBy']) {
  @ApiProperty({
    description: 'The field to order the authors by',
    enum: AuthorOrderableFields,
    enumName: 'AuthorOrderableFields',
    default: AuthorOrderableFields.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: AuthorOrderableFields = AuthorOrderableFields.CREATED_TIMESTAMP;

  @ApiProperty({
    description:
      'Every authors with name containing this name will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Author name must be a string' })
  name?: string;

  @ApiProperty({
    description:
      'Every authors with birth year after this year will be returned',
    required: false,
  })
  @IsOptional()
  @IsPositive({ message: 'Year of birth from must be a positive number' })
  yearOfBirthFrom?: number;

  @ApiProperty({
    description:
      'Every authors with birth year before this year will be returned',
    required: false,
  })
  @IsOptional()
  @IsPositive({ message: 'Year of birth to must be a positive number' })
  yearOfBirthTo?: number;

  @ApiProperty({
    description:
      'Every authors with death year after this year will be returned',
    required: false,
  })
  @IsOptional()
  @IsPositive({ message: 'Year of death from must be a positive number' })
  yearOfDeathFrom?: number;

  @ApiProperty({
    description:
      'Every authors with death year before this year will be returned',
    required: false,
  })
  @IsOptional()
  @IsPositive({ message: 'Year of death to must be a positive number' })
  yearOfDeathTo?: number;

  @ApiProperty({
    description:
      'Every authors with nationality containing this nationality will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nationality must be a string' })
  nationality?: string;
}
