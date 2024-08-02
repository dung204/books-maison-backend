import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutStatus } from '@/modules/checkout/enum/checkout-status.enum';
import { FineSearchDto } from '@/modules/fine/dto/fine-search.dto';
import { FineDto } from '@/modules/fine/dto/fine.dto';
import { PayFineDto } from '@/modules/fine/dto/pay-fine.dto';
import UserFineSearchDto from '@/modules/fine/dto/user-fine-search.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';
import { FineRepository } from '@/modules/fine/repositories/fine.repository';
import { SavedTransactionEventDto } from '@/modules/transaction/dto/saved-transaction-event.dto';
import { TransactionDto } from '@/modules/transaction/dto/transaction.dto';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class FineService {
  constructor(
    @Inject(FineRepository) private readonly fineRepository: FineRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(checkout: Checkout) {
    const existedFineByCheckoutId =
      await this.fineRepository.isExistedByCheckoutId(checkout.id);

    if (existedFineByCheckoutId)
      throw new ConflictException(
        'A fine for this checkout is already created.',
      );

    const fine = new Fine();
    fine.id = `BM_FI_${Date.now()}`;
    fine.checkout = checkout;

    await this.fineRepository.save(fine);
  }

  async findAll(
    fineSearchDto: FineSearchDto,
  ): Promise<SuccessResponse<FineDto[]>> {
    const { page, pageSize } = fineSearchDto;
    const [fines, total] =
      await this.fineRepository.findAllAndCount(fineSearchDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: fines.map(FineDto.fromFine),
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

  async findAllFinesOfCurrentUser(
    user: User,
    userFineSearchDto: UserFineSearchDto,
  ): Promise<SuccessResponse<FineDto[]>> {
    const { page, pageSize } = userFineSearchDto;
    const [fines, total] = await this.fineRepository.findAllAndCount({
      userId: user.id,
      ...userFineSearchDto,
    });
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: fines.map(FineDto.fromFine),
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

  async findOne(user: User, id: string) {
    const fine = await this.fineRepository.findById(id);

    if (!fine) throw new NotFoundException('Fine not found.');

    // Only ADMIN users and the owner of the corresponding checkout are accessible to this
    if (user.role !== Role.ADMIN && fine.checkout.user.id !== user.id)
      throw new ForbiddenException();

    return FineDto.fromFine(fine);
  }

  async cancelFine(id: string): Promise<SuccessResponse<FineDto>> {
    const fine = await this.fineRepository.findById(id);

    if (!fine) throw new NotFoundException('Fine not found.');

    if (fine.status !== FineStatus.ISSUED)
      throw new ConflictException(
        `A fine can only become cancelled if its status is ${FineStatus.ISSUED}`,
      );

    fine.status = FineStatus.CANCELLED;
    return {
      data: FineDto.fromFine(await this.fineRepository.save(fine)),
    };
  }

  async handlePayFine(
    user: User,
    fineId: string,
    { method, redirectUrl }: PayFineDto,
  ): Promise<SuccessResponse<TransactionDto>> {
    const fine = await this.fineRepository.findById(fineId);

    if (!fine) throw new NotFoundException('Fine not found.');

    if (fine.status === FineStatus.PAID)
      throw new ConflictException('Fine is already paid.');

    if (fine.status === FineStatus.CANCELLED)
      throw new ConflictException('Fine is cancelled.');

    if (fine.checkout.status !== CheckoutStatus.RETURNED)
      throw new ConflictException(
        `Checkout is not marked as ${CheckoutStatus.RETURNED}.`,
      );

    const fineDto = FineDto.fromFine(fine);
    return {
      data: await this.transactionService.createTransaction(user, {
        userId: fineDto.checkout.user.id,
        amount: fineDto.amount,
        method,
        redirectUrl,
        extraData: {
          fine,
        },
      }),
    };
  }

  @OnEvent('transaction.saved')
  async handleSetFineAsPaid({
    transaction,
    extraData,
  }: SavedTransactionEventDto) {
    if (
      !extraData ||
      !extraData.fine ||
      !extraData.fine.id ||
      !this.fineRepository.existsBy({ id: extraData.fine.id })
    )
      return;

    const fine: Fine = extraData.fine;
    fine.transaction = transaction;
    fine.status = FineStatus.PAID;
    await this.fineRepository.save(fine);
  }
}
