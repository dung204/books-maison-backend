import { Inject, Injectable } from '@nestjs/common';

import { CreateCashTransactionDto } from '@/modules/transaction/dto/create-cash-transaction.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
  ) {}

  async createCashTransaction({ amount, userId }: CreateCashTransactionDto) {
    const user = await this.userService.findUserById(userId);
    const transaction = new Transaction();

    transaction.id = `BM_${Date.now()}`;
    transaction.user = user;
    transaction.amount = amount;
    transaction.transactionMethod = TransactionMethod.CASH;

    return this.transactionRepository.save(transaction);
  }
}
