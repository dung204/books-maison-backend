import { ApiProperty } from '@nestjs/swagger';

import { Pagination } from '@/base/common/types';

export class SuccessResponse<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  pagination?: Pagination;
}
