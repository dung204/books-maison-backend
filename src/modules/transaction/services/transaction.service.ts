import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { minutesToSeconds } from 'date-fns';
import { Redis } from 'ioredis';

import { Role } from '@/base/common/enum/role.enum';
import { CreateTransactionDto } from '@/modules/transaction/dto/create-transaction.dto';
import { MomoNotifyDto } from '@/modules/transaction/dto/momo-notify.dto';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { TransactionRepository } from '@/modules/transaction/repositories/transaction.repository';
import { CreateMomoLinkSuccessResponse } from '@/modules/transaction/responses/create-momo-link-success.response';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class TransactionService {
  private readonly MOMO_RESULT_CODE_SUCCESS = 0;

  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createTransaction(
    currentUser: User,
    { amount, userId, transactionMethod }: CreateTransactionDto,
  ): Promise<TransactionDto> {
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
    transaction.id = `BM_${Date.now()}`;
    transaction.user = UserDto.fromUser(user);
    transaction.amount = amount;
    transaction.transactionMethod = transactionMethod;

    if (transactionMethod === TransactionMethod.CASH)
      return this.transactionRepository.save(transaction);

    transaction.createdTimestamp = new Date();
    if (transactionMethod === TransactionMethod.MOMO) {
      const purchaseUrl = await this.generateMomoPurchaseLink(
        transaction.id,
        user,
        amount,
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
    orderId: transactionId,
  }: MomoNotifyDto) {
    const transactionStr = await this.redis.get(transactionId);
    if (!transactionStr) throw new NotFoundException('Transaction not found');

    const transaction: Transaction = JSON.parse(transactionStr);
    if (transaction.transactionMethod !== TransactionMethod.MOMO)
      throw new BadRequestException('Transaction method is not MOMO.');

    await this.redis.del(transactionId);
    if (resultCode === this.MOMO_RESULT_CODE_SUCCESS)
      await this.transactionRepository.save(transaction);
  }

  private async generateMomoPurchaseLink(
    transactionId: string,
    user: User,
    amount: number,
  ) {
    const partnerCode =
      this.configService.getOrThrow<string>('MOMO_PARTNER_CODE');
    const accessKey = this.configService.getOrThrow<string>('MOMO_ACCESS_KEY');
    const secretKey = this.configService.getOrThrow<string>('MOMO_SECRET_KEY');
    const requestId = transactionId;
    const orderId = requestId;
    const orderInfo = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()} performs a transaction to Books Maison`;
    const redirectUrl =
      this.configService.getOrThrow<string>('MOMO_REDIRECT_URL');
    const ipnUrl = this.configService.getOrThrow<string>('MOMO_IPN_URL');
    const orderExpireTime = this.configService.getOrThrow<string>(
      'MOMO_EXPIRE_TIME_MINUTES',
    );
    const requestType = 'captureWallet';
    const extraData = '';

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
