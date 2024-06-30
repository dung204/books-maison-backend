import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';

@Injectable()
export class FineRepository extends Repository<Fine> {
  constructor(private readonly dataSource: DataSource) {
    super(Fine, dataSource.createEntityManager());
  }

  findAllAndCount({ page, pageSize }: PaginationQueryDto) {
    const skip = (page - 1) * pageSize;
    return this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
  }

  findById(id: string) {
    return this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .where('fine.id = :id', { id })
      .getOne();
  }

  isExistedByCheckoutId(checkoutId: string) {
    return this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .where('checkout.id = :checkoutId', { checkoutId })
      .getExists();
  }
}
