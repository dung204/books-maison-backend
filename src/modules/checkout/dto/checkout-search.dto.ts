import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';

export class CheckoutSearchDto extends PaginationQueryDto {
  userId?: string;
}
