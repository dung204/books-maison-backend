import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionController } from '@/modules/transaction/controllers';
import { Transaction } from '@/modules/transaction/entities';
import { TransactionRepository } from '@/modules/transaction/repositories';
import { TransactionService } from '@/modules/transaction/services';
import { UserModule } from '@/modules/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule,
    HttpModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
