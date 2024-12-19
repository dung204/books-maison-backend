import { RedisService } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { minutesToSeconds } from 'date-fns';
import { Redis } from 'ioredis';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';
import { MomoNotifyDto } from '@/modules/transaction/dto/momo-notify.dto';
import { SavedTransactionEventDto } from '@/modules/transaction/dto/saved-transaction-event.dto';
import { TransactionSearchDto } from '@/modules/transaction/dto/transaction-search.dto';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionEvents } from '@/modules/transaction/enums/transaction-events.enum';
import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { CreateMomoLinkSuccessResponse } from '@/modules/transaction/responses/create-momo-link-success.response';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);
  private readonly MOMO_RESULT_CODE_SUCCESS = 0;
  private readonly redis: Redis;

  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  async findAll(
    transactionSearchDto: TransactionSearchDto,
  ): Promise<SuccessResponse<Transaction[]>> {
    const { page, pageSize } = transactionSearchDto;
    const [transactions, total] =
      await this.transactionRepository.findAllAndCount(transactionSearchDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: transactions,
      pagination: {
        total,
        page,
        pageSize,
        totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(
    user: User,
    id: string,
  ): Promise<SuccessResponse<Transaction>> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) throw new NotFoundException('Fine not found.');

    // Only ADMIN users and the owner of the transaction are accessible to this
    if (user.role !== Role.ADMIN && transaction.user.id !== user.id)
      throw new ForbiddenException();

    return {
      data: transaction,
    };
  }

  async createTransaction(
    currentUser: User,
    {
      amount,
      userId,
      method: transactionMethod,
      redirectUrl,
      extraData,
    }: CreateTransactionDto,
  ): Promise<TransactionDto> {
    this.logger.log(extraData);
    if (
      currentUser.role !== Role.ADMIN &&
      transactionMethod === TransactionMethod.CASH
    )
      throw new ForbiddenException('Only ADMIN can create cash transaction.');

    let user: User;
    if (transactionMethod === TransactionMethod.CASH) {
      if (!userId)
        throw new BadRequestException(
          'User ID is required for cash transaction',
        );
      user = await this.userService.findUserById(userId);
    } else {
      user = currentUser;
    }

    const transaction = new Transaction();
    transaction.id = `BM_TR_${Date.now()}`;
    transaction.user = UserDto.fromUser(user);
    transaction.amount = amount;
    transaction.method = transactionMethod;

    if (transactionMethod === TransactionMethod.CASH) {
      const savedTransaction =
        await this.transactionRepository.save(transaction);
      await this.eventEmitter.emitAsync(
        TransactionEvents.SAVED,
        new SavedTransactionEventDto(savedTransaction, extraData),
      );
      return savedTransaction;
    }

    transaction.createdTimestamp = new Date();
    if (transactionMethod === TransactionMethod.MOMO) {
      const purchaseUrl = await this.generateMomoPurchaseLink(
        transaction.id,
        user,
        amount,
        redirectUrl,
        extraData,
      );

      this.redis.set(
        transaction.id,
        JSON.stringify(transaction),
        'EX',
        minutesToSeconds(
          +this.configService.getOrThrow<string>('MOMO_EXPIRE_TIME_MINUTES'),
        ),
      );
      return {
        ...transaction,
        purchaseUrl,
      };
    }
  }

  async handleMomoTransactionNotify({
    resultCode,
    extraData,
    orderId: transactionId,
  }: MomoNotifyDto) {
    const transactionStr = await this.redis.get(transactionId);
    if (!transactionStr) throw new NotFoundException('Transaction not found');

    const transaction: Transaction = JSON.parse(transactionStr);
    if (transaction.method !== TransactionMethod.MOMO)
      throw new BadRequestException('Transaction method is not MOMO.');

    await this.redis.del(transactionId);
    if (resultCode === this.MOMO_RESULT_CODE_SUCCESS) {
      const savedTransaction =
        await this.transactionRepository.save(transaction);
      await this.eventEmitter.emitAsync(
        TransactionEvents.SAVED,
        new SavedTransactionEventDto(
          savedTransaction,
          JSON.parse(Buffer.from(extraData, 'base64').toString('utf-8')),
        ),
      );
    }
  }

  private async generateMomoPurchaseLink(
    transactionId: string,
    user: User,
    amount: number,
    redirectUrl: string,
    additionalData?: Record<string, any>,
  ) {
    const partnerCode =
      this.configService.getOrThrow<string>('MOMO_PARTNER_CODE');
    const accessKey = this.configService.getOrThrow<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.getOrThrow<string>('MOMO_SECRET_KEY');
    const requestId = transactionId;
    const orderId = requestId;
    const orderInfo = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()} performs a transaction to Books Maison`;
    const ipnUrl = this.configService.getOrThrow<string>('MOMO_IPN_URL');
    const orderExpireTime = this.configService.getOrThrow<string>(
      'MOMO_EXPIRE_TIME_MINUTES',
    );
    const requestType = 'captureWallet';
    const extraData = !additionalData
      ? ''
      : Buffer.from(JSON.stringify(additionalData)).toString('base64');

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      orderExpireTime,
      lang: 'en',
    });

    const res =
      await this.httpService.axiosRef.post<CreateMomoLinkSuccessResponse>(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
          },
        },
      );

    const { payUrl } = res.data;
    return payUrl;
  }
}
