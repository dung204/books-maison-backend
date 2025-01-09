import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { CommonQueryDto } from '@/base/common/dtos';
import {
  TransactionMethod,
  TransactionOrderableField,
} from '@/modules/transaction/enums';

export class TransactionSearchDto extends OmitType(CommonQueryDto, [
  'orderBy',
]) {
  @ApiProperty({
    description: 'The field to order the transactions by',
    enum: TransactionOrderableField,
    enumName: 'TransactionOrderableField',
    default: TransactionOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: TransactionOrderableField =
    TransactionOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description: 'Every transactions of this user will be returned',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId?: string;

  @ApiProperty({
    description:
      'Every transactions using one of these methods will be returned',
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionMethod, {
    each: true,
    message: `Transaction method must be one of these values: ${Object.values(TransactionMethod).join(', ')}`,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  method?: TransactionMethod[];
}
