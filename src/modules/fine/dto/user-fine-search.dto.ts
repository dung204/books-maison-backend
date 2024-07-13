import { OmitType } from '@nestjs/swagger';

import { FineSearchDto } from '@/modules/fine/dto/fine-search.dto';

export default class UserFineSearchDto extends OmitType(FineSearchDto, [
  'userId',
]) {}
