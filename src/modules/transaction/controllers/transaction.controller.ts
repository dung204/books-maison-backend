import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { CreateCashTransactionDto } from '@/modules/transaction/dto/create-cash-transaction.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionService } from '@/modules/transaction/services/transaction.service';

@ApiBearerAuth('JWT')
@ApiTags('transactions')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: 'Create a cash transaction (for ADMIN only)',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Post('/create/cash')
  async createCashTransaction(
    @Query() createCashTransactionDto: CreateCashTransactionDto,
  ): Promise<SuccessResponse<Transaction>> {
    return {
      data: await this.transactionService.createCashTransaction(
        createCashTransactionDto,
      ),
    };
  }
}
