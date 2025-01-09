import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { CommonQueryDto } from '@/base/common/dtos';
import { CategoryOrderableField } from '@/modules/category/enums';

export class CategorySearchDto extends OmitType(CommonQueryDto, ['orderBy']) {
  @ApiProperty({
    description: 'The field to order the categories by',
    enum: CategoryOrderableField,
    enumName: 'CategoryOrderableFields',
    default: CategoryOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: CategoryOrderableField = CategoryOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description:
      'Every categories with name containing this name will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Category name must be a string' })
  name?: string;
}
