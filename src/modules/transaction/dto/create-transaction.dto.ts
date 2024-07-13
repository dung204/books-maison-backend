import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsUUID,
  IsUrl,
} from 'class-validator';

import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';

export class CreateTransactionDto {
  @ApiProperty({
    description:
      'The UUID of the user who performed the transaction, required only for cash transaction',
    example: '79c66ac2-8f21-593c-b08b-359e75fac41e',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId?: string;

  @ApiProperty({
    description: 'The money amount of the transaction',
    example: 100_000,
  })
  @IsNotEmpty({ message: 'Money amount is required' })
  @IsInt({ message: 'Money amount must be an integer' })
  @IsPositive({ message: 'Money amount must be a positive integer' })
  amount: number;

  @ApiProperty({
    description: 'The method that the transaction is performed',
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  @IsNotEmpty({ message: 'Transaction method is required' })
  @IsEnum(TransactionMethod, {
    message: `Transaction method must be one these values: ${Object.values(TransactionMethod).join(', ')}`,
  })
  method: TransactionMethod;

  @ApiProperty({
    description:
      'The URL that redirects the user after the transaction is finished',
    example: 'http://bamzuzpic.tl/agi',
    required: false,
  })
  @Transform(({ value }) => value || '')
  @IsOptional()
  @IsUrl({}, { message: 'Redirect URL must be a valid URL.' })
  redirectUrl: string;

  @ApiProperty({
    description: 'The extra data for the transaction',
    example: {
      key1: 'value1',
      key2: 'value2',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  extraData?: Record<string, any>;
}
