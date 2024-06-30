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
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineRepository } from '@/modules/fine/repositories/fine.repository';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class FineService {
  constructor(
    @Inject(FineRepository) private readonly fineRepository: FineRepository,
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
  ): Promise<SuccessResponse<Fine[]>> {
    const { page, pageSize } = paginationQueryDto;
    const [fines, total] =
      await this.fineRepository.findAllAndCount(paginationQueryDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: fines,
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

    if (!fine) throw new NotFoundException();

    // Only ADMIN users and the owner of the corresponding checkout are accessible to this
    if (user.role !== Role.ADMIN && fine.checkout.user.id !== user.id)
      throw new ForbiddenException();

    return fine;
  }
}
