import { Role } from '@/base/common/enum/role.enum';

export type JwtPayload = {
  sub: string;
  role?: Role;
  exp?: number;
};
