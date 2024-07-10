import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

import { Order } from '@/base/common/enum/order.enum';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'The current page number',
    default: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page must be an integer' })
  @IsPositive({ message: 'Page must be a positive integer' })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items in a page',
    default: 10,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Page size must be an integer' })
  @IsPositive({ message: 'Page size must be a positive integer' })
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({
    description: 'The field to order the results by',
    default: 'createdTimestamp',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: string = 'createdTimestamp';

  @ApiProperty({
    description: 'The order to sort the results',
    enum: Order,
    enumName: 'Order',
    default: Order.DESC,
    required: false,
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  @IsEnum(Order, {
    message: `Order must be one of these values: ${Object.values(Order).join(', ')}`,
  })
  order?: Order = Order.DESC;
}
