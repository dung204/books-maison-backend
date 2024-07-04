import { OmitType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';

export class CreateCashTransactionDto extends OmitType(CreateTransactionDto, [
  'transactionMethod',
]) {}
