import { OmitType } from '@nestjs/swagger';

import { FineSearchDto } from '@/modules/fine/dtos';

export default class UserFineSearchDto extends OmitType(FineSearchDto, [
  'userId',
]) {}
