import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(private readonly dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async findAllAndCount({ page, pageSize }: PaginationQueryDto) {
    const skip = (page - 1) * pageSize;
    return this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.user', 'user')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }
}
