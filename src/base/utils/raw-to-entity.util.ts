import { ClassConstructor, plainToInstance } from 'class-transformer';

import { StringUtils } from '@/base/utils/string.utils';

export function rawToEntity<T>(
  entity: ClassConstructor<T>,
  raw: any,
  prefix: string = '',
) {
  let transformData: Record<string, any> = {};
  Object.keys(raw).map((key) => {
    if (key.slice(0, prefix.length + 1) == `${prefix}_`) {
      transformData = {
        ...transformData,
        [StringUtils.snakeToCamel(key.slice(prefix.length + 1, key.length))]:
          raw[key],
      };
    }
  });

  return plainToInstance(entity, transformData);
}
