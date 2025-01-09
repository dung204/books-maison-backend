import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FineController } from '@/modules/fine/controllers';
import { Fine } from '@/modules/fine/entities';
import { FineRepository } from '@/modules/fine/repositories';
import { FineService } from '@/modules/fine/services';
import { TransactionModule } from '@/modules/transaction';

@Module({
  imports: [TypeOrmModule.forFeature([Fine]), TransactionModule],
  controllers: [FineController],
  providers: [FineService, FineRepository],
  exports: [FineService],
})
export class FineModule {}
