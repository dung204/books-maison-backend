import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineRepository } from '@/modules/fine/repositories/fine.repository';
import { TransactionModule } from '@/modules/transaction/transaction.module';

import { FineController } from './controllers/fine.controller';
import { FineService } from './services/fine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fine]), TransactionModule],
  controllers: [FineController],
  providers: [FineService, FineRepository],
  exports: [FineService],
})
export class FineModule {}
