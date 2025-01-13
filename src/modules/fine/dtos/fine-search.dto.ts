import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonQueryDto } from '@/base/common/dtos';
import { FineOrderableField, FineStatus } from '@/modules/fine/enums';

export class FineSearchDto extends OmitType(CommonQueryDto, ['orderBy']) {
  @ApiProperty({
    description: 'The field to order the results by',
    enum: FineOrderableField,
    enumName: 'FineOrderableField',
    default: FineOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy: FineOrderableField = FineOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description: 'Every fines of this user will be returned',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId?: string;

  @ApiProperty({
    description: 'Every fines containing of these statuses will be returned',
    required: false,
    enum: FineStatus,
    enumName: 'FineStatus',
    isArray: true,
  })
  @IsOptional()
  @IsEnum(FineStatus, {
    each: true,
    message: `Fine status must be one of these three values: ${Object.values(FineStatus).join(', ')}`,
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    return value;
  })
  status?: FineStatus[];

  @ApiProperty({
    description: 'Every fines created after this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'From created timestamp must follow this pattern: YYYY-MM-DD' },
  )
  fromCreatedTimestamp?: string;

  @ApiProperty({
    description: 'Every fines created before this timestamp will be returned',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'To checkout timestamp must follow this pattern: YYYY-MM-DD' },
  )
  toCreatedTimestamp?: string;
}
