import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';

@Injectable()
export class CheckoutRepository extends Repository<Checkout> {
  constructor(private dataSource: DataSource) {
    super(Checkout, dataSource.createEntityManager());
  }

  async findById(id: string) {
    return this.createQueryBuilder('checkout')
      .leftJoinAndSelect('checkout.user', 'user')
      .leftJoinAndSelect('checkout.book', 'book')
      .where('checkout.id = :id', { id })
      .getOne();
  }
}
