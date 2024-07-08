import { PickType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';

export class PayFineDto extends PickType(CreateTransactionDto, [
  'transactionMethod',
]) {}
