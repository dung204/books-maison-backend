import { Inject, Injectable } from '@nestjs/common';

import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}
}
