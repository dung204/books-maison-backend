import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';
import { MomoNotifyDto } from '@/modules/transaction/dto/momo-notify.dto';
import { TransactionSearchDto } from '@/modules/transaction/dto/transaction-search.dto';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { UserTransactionSearchDto } from '@/modules/transaction/dto/user-transaction-search.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionService } from '@/modules/transaction/services/transaction.service';

@ApiBearerAuth('JWT')
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

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
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Get('/')
  async findAll(@Query() transactionSearchDto: TransactionSearchDto) {
    return this.transactionService.findAll(transactionSearchDto);
  }

  @ApiOperation({
    summary: 'Get all transactions of the current authenticated user',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Transaction,
    isArray: false,
    pagination: true,
    description:
      'Get all transactions successfully (with pagination metadata).',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get('/me')
  async findAllTransactionsOfCurrentUser(
    @Request() req: CustomRequest,
    @Query() userTransactionSearchDto: UserTransactionSearchDto,
  ) {
    const currentUser = req.user;
    return this.transactionService.findAll({
      userId: currentUser.id,
      ...userTransactionSearchDto,
    });
  }

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
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the transaction.',
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get(':id')
  async findById(@Request() req: CustomRequest, @Param('id') id: string) {
    const currentUser = req.user;
    return this.transactionService.findById(currentUser, id);
  }

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
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN, and trying to create a cash transaction.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Post('/notify/momo')
  async momoTransactionNotify(@Body() momoNotifyDto: MomoNotifyDto) {
    return this.transactionService.handleMomoTransactionNotify(momoNotifyDto);
  }
}