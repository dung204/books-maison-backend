import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';

export class FineSearchDto extends PaginationQueryDto {
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
