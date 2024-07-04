import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutStatus } from '@/modules/checkout/enum/checkout-status.enum';
import { FineDto } from '@/modules/fine/dto/fine.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';
import { FineRepository } from '@/modules/fine/repositories/fine.repository';
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
    fine.checkout = checkout;

    await this.fineRepository.save(fine);
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<FineDto[]>> {
    const { page, pageSize } = paginationQueryDto;
    const [fines, total] =
      await this.fineRepository.findAllAndCount(paginationQueryDto);
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

  async confirmPaidByCash(fineId: string): Promise<SuccessResponse<FineDto>> {
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
    const transaction = await this.transactionService.createCashTransaction({
      userId: fineDto.checkout.user.id,
      amount: fineDto.amount,
    });

    fine.transaction = transaction;
    fine.status = FineStatus.PAID;

    return {
      data: FineDto.fromFine(await this.fineRepository.save(fine)),
    };
  }
}
