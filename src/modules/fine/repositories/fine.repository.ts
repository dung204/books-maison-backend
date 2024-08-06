import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { FineSearchDto } from '@/modules/fine/dto/fine-search.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineOrderableField } from '@/modules/fine/enums/fine-orderable-field.enum';

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
    const query = this.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.checkout', 'checkout')
      .leftJoinAndSelect('fine.transaction', 'transaction')
      .leftJoinAndSelect('checkout.user', 'checkoutUser')
      .leftJoinAndSelect('checkout.book', 'book')
      .leftJoinAndSelect('book.authors', 'authors')
      .leftJoinAndSelect('book.categories', 'categories')
      .leftJoinAndSelect('transaction.user', 'transactionUser')
      .orderBy(this.resolveOrderBy(orderBy), order)
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

  private resolveOrderBy(orderBy: FineOrderableField) {
    if (Object.values(FineOrderableField).includes(orderBy)) {
      if (orderBy === FineOrderableField.CHECKOUT) return `checkout.id`;
      return `fine.${orderBy}`;
    }

    return `fine.${FineOrderableField.CREATED_TIMESTAMP}`;
  }
}
