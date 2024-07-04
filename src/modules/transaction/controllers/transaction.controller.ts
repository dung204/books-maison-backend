import { Controller } from '@nestjs/common';

import { TransactionService } from '@/modules/transaction/services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
