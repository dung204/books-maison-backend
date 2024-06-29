import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { CheckoutStatus } from '@/modules/checkout/enum/checkout-status.enum';

export class CheckoutSearchDto extends PaginationQueryDto {
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
    { message: 'From checkout timestamp must follow this pattern: YYYY-MM-DD' },
  )
  fromCheckoutTimestamp?: string;

  @ApiProperty({
    description:
      'Every checkouts created before this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'To checkout timestamp must follow this pattern: YYYY-MM-DD' },
  )
  toCheckoutTimestamp?: string;

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
