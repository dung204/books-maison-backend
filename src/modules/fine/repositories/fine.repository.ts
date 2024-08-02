import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FINE_ORDERABLE_FIELDS } from '@/modules/fine/constants/fine-orderable-fields.constant';
import { FineSearchDto } from '@/modules/fine/dto/fine-search.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';

@Injectable()
export class FineRepository extends Repository<Fine> {
  constructor(private readonly dataSource: DataSource) {
    super(Fine, dataSource.createEntityManager());
  }

  findAllAndCount({
    userId,
    status: statuses,
    fromCreatedTimestamp,
    toCreatedTimestamp,
    page,
    pageSize,
    orderBy,
    order,
  }: FineSearchDto) {
    const skip = (page - 1) * pageSize;
    orderBy = FINE_ORDERABLE_FIELDS.includes(orderBy)
      ? orderBy
      : 'createdTimestamp';
    const query = this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .leftJoinAndSelect('fine.transaction', 'transaction')
      .leftJoinAndSelect('checkout.user', 'checkoutUser')
      .leftJoinAndSelect('checkout.book', 'book')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('transaction.user', 'transactionUser')
      .orderBy(`fine.${orderBy}`, order)
      .skip(skip)
      .take(pageSize);

    if (userId) {
      query.andWhere('checkout.user.id = :userId', { userId });
    }

    if (statuses) {
      query.andWhere('fine.status IN (:...statuses)', { statuses });
    }

    if (fromCreatedTimestamp) {
      query.andWhere('checkout.createdTimestamp >= :fromCreatedTimestamp', {
        fromCreatedTimestamp,
      });
    }

    if (toCreatedTimestamp) {
      query.andWhere('checkout.createdTimestamp <= :toCreatedTimestamp', {
        toCreatedTimestamp,
      });
    }

    return query.getManyAndCount();
  }

  findById(id: string) {
    return this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .leftJoinAndSelect('fine.transaction', 'transaction')
      .leftJoinAndSelect('checkout.user', 'checkoutUser')
      .leftJoinAndSelect('checkout.book', 'book')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('transaction.user', 'transactionUser')
      .where('fine.id = :id', { id })
      .getOne();
  }

  isExistedByCheckoutId(checkoutId: string) {
    return this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .leftJoinAndSelect('fine.transaction', 'transaction')
      .leftJoinAndSelect('checkout.user', 'checkoutUser')
      .leftJoinAndSelect('checkout.book', 'book')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('transaction.user', 'transactionUser')
      .where('checkout.id = :checkoutId', { checkoutId })
      .getExists();
  }
}
