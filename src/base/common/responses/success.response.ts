import { Pagination } from '@/base/common/types/pagination.type';

export interface SuccessResponse<T> {
  data: T;
  pagination?: Pagination;
}
