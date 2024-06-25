import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CheckoutStatus } from '@/base/common/enum/checkout-status.enum';
import { CheckoutSearchDto } from '@/modules/checkout/dto/checkout-search.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';

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
        status: CheckoutStatus.RENTING,
      })
      .getOne();
  }

  findAllAndCount({ userId, page, pageSize }: CheckoutSearchDto) {
    const skip = (page - 1) * pageSize;
    const query = this.createQueryBuilder('checkout')
      .leftJoinAndSelect('checkout.user', 'user')
      .leftJoinAndSelect('checkout.book', 'book')
      .skip(skip)
      .take(pageSize);

    if (userId) {
      query.andWhere('checkout.user.id = :userId', { userId });
    }

    return query.getManyAndCount();
  }
}
