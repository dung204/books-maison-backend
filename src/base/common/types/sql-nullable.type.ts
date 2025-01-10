import { StringUtils } from '@/base/utils';

export type SQLNullable<T> = T | typeof StringUtils.SQL_NULL;
