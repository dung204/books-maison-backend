import { PickType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/modules/transaction/dtos';

export class PayFineDto extends PickType(CreateTransactionDto, [
  'method',
  'redirectUrl',
]) {}
