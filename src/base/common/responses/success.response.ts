import { ApiProperty } from '@nestjs/swagger';

import { Pagination } from '@/base/common/types/pagination.type';

export class SuccessResponse<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  pagination?: Pagination;
}
