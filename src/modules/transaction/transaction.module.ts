import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { TransactionService } from '@/modules/transaction/services/transaction.service';

import { TransactionController } from './controllers/transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
