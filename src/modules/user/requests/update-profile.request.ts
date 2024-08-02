import { OmitType, PartialType } from '@nestjs/swagger';

import { RegisterRequest } from '@/modules/auth/requests/register.request';

export class UpdateProfileRequest extends PartialType(
  OmitType(RegisterRequest, ['password']),
) {}
