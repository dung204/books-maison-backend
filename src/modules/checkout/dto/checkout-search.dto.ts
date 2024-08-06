import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { CheckoutOrderableField } from '@/modules/checkout/enums/checkout-orderable-field.enum';
import { CheckoutStatus } from '@/modules/checkout/enums/checkout-status.enum';

export class CheckoutSearchDto extends OmitType(PaginationQueryDto, [
  'orderBy',
]) {
  @ApiProperty({
    description: 'The field to order the results by',
    enum: CheckoutOrderableField,
    enumName: 'CheckoutOrderableFields',
    default: CheckoutOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: CheckoutOrderableField = CheckoutOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description: 'Every checkouts of this user will be returned',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId?: string;

  @ApiProperty({
    description: 'Every checkouts having this book will be returned',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'Book ID must be a valid UUID v4' })
  bookId?: string;

  @ApiProperty({
    description: 'Every checkouts having this status will be returned',
    required: false,
  })
  @IsOptional()
  @IsEnum(CheckoutStatus, {
    message: `Checkout status must be one of these values: ${Object.values(CheckoutStatus).join(', ')}`,
  })
  status?: CheckoutStatus;

  @ApiProperty({
    description:
      'Every checkouts created after this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'From created timestamp must follow this pattern: YYYY-MM-DD' },
  )
  fromCreatedTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts created before this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'To created timestamp must follow this pattern: YYYY-MM-DD' },
  )
  toCreatedTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts with due timestamp after this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'From due timestamp must follow this pattern: YYYY-MM-DD' },
  )
  fromDueTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts with due timestamp before this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'To due timestamp must follow this pattern: YYYY-MM-DD' },
  )
  toDueTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts with returned timestamp after this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'From returned timestamp must follow this pattern: YYYY-MM-DD' },
  )
  fromReturnedTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts with returned timestamp before this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'To returned timestamp must follow this pattern: YYYY-MM-DD' },
  )
  toReturnedTimestamp?: string;
}
