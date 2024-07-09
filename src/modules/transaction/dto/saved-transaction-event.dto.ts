import { Transaction } from '@/modules/transaction/entities/transaction.entity';

export class SavedTransactionEventDto {
  transaction: Transaction;
  extraData?: Record<string, any>;

  constructor(transaction: Transaction, extraData: Record<string, any>) {
    this.transaction = transaction;
    this.extraData = extraData;
  }
}
