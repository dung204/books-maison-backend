import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TransactionSearchDto } from '@/modules/transaction/dto/transaction-search.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private readonly dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async findAllAndCount({
    userId,
    method: methods,
    page,
    pageSize,
  }: TransactionSearchDto) {
    const skip = (page - 1) * pageSize;
    const query = this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .skip(skip)
      .take(pageSize);

    if (userId) {
      query.andWhere('transaction.user.id = :userId', { userId });
    }

    if (methods) {
      query.andWhere('transaction.method IN (:...methods)', { methods });
    }

    return query.getManyAndCount();
  }
}
