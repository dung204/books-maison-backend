import { Request } from 'express';

import { User } from '@/modules/user/entities';

export interface CustomRequest extends Request {
  user?: User;
}
