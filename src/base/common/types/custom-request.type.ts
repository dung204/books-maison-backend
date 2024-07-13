import { Request } from 'express';

import { User } from '@/modules/user/entities/user.entity';

export interface CustomRequest extends Request {
  user?: User;
}
