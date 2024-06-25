import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CreateCheckoutDto } from '@/modules/checkout/dto/create-checkout.dto';
import { UpdateCheckoutDto } from '@/modules/checkout/dto/update-checkout.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutRepository } from '@/modules/checkout/repositories/checkout.repository';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class CheckoutService {
  constructor(private readonly checkoutRepository: CheckoutRepository) {}

  create(createCheckoutDto: CreateCheckoutDto) {
    createCheckoutDto;
    return 'This action adds a new checkout';
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<Checkout[]>> {
    const { page, pageSize } = paginationQueryDto;
    const skip = (page - 1) * pageSize;
    const [checkouts, total] = await this.checkoutRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: checkouts,
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
    const checkout = await this.checkoutRepository.findById(id);

    if (!checkout) throw new NotFoundException('Checkout not found.');

    // Only ADMIN users and the owner of this checkout are accessible to this
    if (user.role !== Role.ADMIN && checkout.user.id !== user.id)
      throw new ForbiddenException();

    return checkout;
  }

  update(id: number, updateCheckoutDto: UpdateCheckoutDto) {
    updateCheckoutDto;
    return `This action updates a #${id} checkout`;
  }

  remove(id: number) {
    return `This action removes a #${id} checkout`;
  }
}
