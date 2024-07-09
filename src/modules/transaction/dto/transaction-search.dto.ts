import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';

export class TransactionSearchDto extends PaginationQueryDto {
  @ApiProperty({
    description: 'Every transactions of this user will be returned',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'User ID must be a valid UUID v4' })
  userId?: string;
}
