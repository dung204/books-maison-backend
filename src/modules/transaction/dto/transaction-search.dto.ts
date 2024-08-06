import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { TransactionOrderableField } from '@/modules/transaction/enums/transaction-orderable-field.enum';

export class TransactionSearchDto extends OmitType(PaginationQueryDto, [
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
