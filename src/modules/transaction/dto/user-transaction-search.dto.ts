import { OmitType } from '@nestjs/swagger';

import { TransactionSearchDto } from '@/modules/transaction/dto/transaction-search.dto';

export class UserTransactionSearchDto extends OmitType(TransactionSearchDto, [
  'userId',
]) {}
