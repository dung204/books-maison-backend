import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';

@Injectable()
export class CheckoutRepository extends Repository<Checkout> {
  constructor(private dataSource: DataSource) {
    super(Checkout, dataSource.createEntityManager());
  }
}
