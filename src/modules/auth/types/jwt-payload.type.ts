import { Role } from '@/base/common/enum';

export type JwtPayload = {
  sub: string;
  role?: Role;
  exp?: number;
};
