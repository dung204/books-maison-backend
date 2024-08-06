import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CheckoutSearchDto } from '@/modules/checkout/dto/checkout-search.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutOrderableField } from '@/modules/checkout/enums/checkout-orderable-field.enum';
import { CheckoutStatus } from '@/modules/checkout/enums/checkout-status.enum';

@Injectable()
export class CheckoutRepository extends Repository<Checkout> {
  constructor(private dataSource: DataSource) {
    super(Checkout, dataSource.createEntityManager());
  }

  findById(id: string) {
    return this.createQueryBuilder('checkout')
      .leftJoinAndSelect('checkout.user', 'user')
      .leftJoinAndSelect('checkout.book', 'book')
      .where('checkout.id = :id', { id })
      .getOne();
  }

  findRentingCheckoutByUserIdAndBookId(userId: string, bookId: string) {
    return this.createQueryBuilder('checkout')
      .andWhere('checkout.user.id = :userId', { userId })
      .andWhere('checkout.book.id = :bookId', { bookId })
      .andWhere('checkout.status = :status', {
        status: CheckoutStatus.BORROWING,
      })
      .getOne();
  }

  findAllAndCount({
    page,
    pageSize,
    orderBy,
    order,
    userId,
    bookId,
    status,
    fromCreatedTimestamp,
    toCreatedTimestamp,
    fromDueTimestamp,
    toDueTimestamp,
    fromReturnedTimestamp,
    toReturnedTimestamp,
  }: CheckoutSearchDto) {
    const skip = (page - 1) * pageSize;
    const query = this.createQueryBuilder('checkout')
      .leftJoinAndSelect('checkout.user', 'user')
      .leftJoinAndSelect('checkout.book', 'book')
      .leftJoinAndSelect('book.authors', 'author')
      .leftJoinAndSelect('book.categories', 'category')
      .orderBy(this.resolveOrderBy(orderBy), order)
      .skip(skip)
      .take(pageSize);

    if (userId) {
      query.andWhere('checkout.user.id = :userId', { userId });
    }

    if (bookId) {
      query.andWhere('checkout.book.id = :bookId', { bookId });
    }

    if (fromCreatedTimestamp) {
      query.andWhere('checkout.checkoutTimestamp >= :fromCreatedTimestamp', {
        fromCreatedTimestamp,
      });
    }

    if (toCreatedTimestamp) {
      query.andWhere('checkout.checkoutTimestamp <= :toCreatedTimestamp', {
        toCreatedTimestamp,
      });
    }

    if (fromDueTimestamp) {
      query.andWhere('checkout.dueTimestamp >= :fromDueTimestamp', {
        fromDueTimestamp,
      });
    }

    if (toDueTimestamp) {
      query.andWhere('checkout.dueTimestamp <= :toDueTimestamp', {
        toDueTimestamp,
      });
    }

    if (fromReturnedTimestamp) {
      query.andWhere('checkout.returnedTimestamp >= :fromReturnedTimestamp', {
        fromReturnedTimestamp,
      });
    }

    if (toReturnedTimestamp) {
      query.andWhere('checkout.returnedTimestamp <= :toReturnedTimestamp', {
        toReturnedTimestamp,
      });
    }

    if (status) {
      query.andWhere('checkout.status = :status', { status });
    }

    return query.getManyAndCount();
  }

  getRentingCheckoutsDueBeforeToday() {
    return this.createQueryBuilder('checkout')
      .where('checkout.status = :status', { status: CheckoutStatus.BORROWING })
      .andWhere('checkout.dueTimestamp < CURRENT_TIMESTAMP')
      .getMany();
  }

  private resolveOrderBy(orderBy: CheckoutOrderableField) {
    if (Object.values(CheckoutOrderableField).includes(orderBy)) {
      if (orderBy === CheckoutOrderableField.BOOK) return 'book.title';
      return `checkout.${orderBy}`;
    }

    return `checkout.${CheckoutOrderableField.CREATED_TIMESTAMP}`;
  }
}
