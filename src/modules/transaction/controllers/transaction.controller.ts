import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Admin } from '@/base/common/decorators/admin.decorator';
import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { Private } from '@/base/common/decorators/private.decorator';
import { Public } from '@/base/common/decorators/public.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';
import { MomoNotifyDto } from '@/modules/transaction/dto/momo-notify.dto';
import { TransactionSearchDto } from '@/modules/transaction/dto/transaction-search.dto';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionService } from '@/modules/transaction/services/transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Admin()
  @ApiOperation({
    summary: 'Get all transaction (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Transaction,
    isArray: false,
    pagination: true,
    description:
      'Get all transactions information successfully (with pagination metadata).',
  })
  @Get('/')
  async findAll(@Query() transactionSearchDto: TransactionSearchDto) {
    return this.transactionService.findAll(transactionSearchDto);
  }

  @Private()
  @ApiOperation({
    summary: 'Get a transaction by ID',
    description:
      'Only ADMIN users and the owner of the transaction are accessible to the transaction',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Transaction,
    isArray: false,
    description: 'Transaction is retrieved successfully.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the transaction.',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found.',
  })
  @Get(':id')
  async findById(@Request() req: CustomRequest, @Param('id') id: string) {
    const currentUser = req.user;
    return this.transactionService.findById(currentUser, id);
  }

  @Private()
  @ApiOperation({
    summary: 'Create a transaction',
    description: 'For cash transactions, only ADMIN can create',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: TransactionDto,
    isArray: false,
    description: 'Success transaction creation.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN, and trying to create a cash transaction.',
  })
  @Post('/create')
  async createCashTransaction(
    @Request() req: CustomRequest,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponse<Transaction>> {
    const currentUser = req.user;

    return {
      data: await this.transactionService.createTransaction(
        currentUser,
        createTransactionDto,
      ),
    };
  }

  @Public()
  @ApiOperation({
    summary: 'Callback route for Momo API to notify Momo transactions',
  })
  @ApiBody({
    type: MomoNotifyDto,
    description:
      'For more details: [`https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/`](https://developers.momo.vn/v3/docs/payment/api/wallet/onetime/)',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found.',
  })
  @ApiBadRequestResponse({
    description: 'The current transaction is not a Momo transaction.',
  })
  @Post('/notify/momo')
  async momoTransactionNotify(@Body() momoNotifyDto: MomoNotifyDto) {
    return this.transactionService.handleMomoTransactionNotify(momoNotifyDto);
  }
}
