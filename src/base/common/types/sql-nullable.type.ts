/* eslint-disable @typescript-eslint/ban-types */
import { StringUtils } from '@/base/utils';

type SQLNullOrAnyStrings = typeof StringUtils.SQL_NULL | (string & {});

export type SQLNullable<T> = string extends T
  ? SQLNullOrAnyStrings
  : T | typeof StringUtils.SQL_NULL;
