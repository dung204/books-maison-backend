import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Transaction } from '@/modules/transaction/entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private readonly dataSource: DataSource) {
    super(
      Transaction,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }
}
