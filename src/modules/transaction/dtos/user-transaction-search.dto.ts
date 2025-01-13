import { OmitType } from '@nestjs/swagger';

import { TransactionSearchDto } from '@/modules/transaction/dtos';

export class UserTransactionSearchDto extends OmitType(TransactionSearchDto, [
  'userId',
]) {}
