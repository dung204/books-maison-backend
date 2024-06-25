import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { BookService } from '@/modules/book/services/book.service';
import { CheckoutSearchDto } from '@/modules/checkout/dto/checkout-search.dto';
import { CreateCheckoutDto } from '@/modules/checkout/dto/create-checkout.dto';
import { UserCheckoutSearchDto } from '@/modules/checkout/dto/user-checkout-search.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutRepository } from '@/modules/checkout/repositories/checkout.repository';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class CheckoutService {
  private readonly TWO_WEEKS_AS_MS = 1_209_600_000;

  constructor(
    private readonly checkoutRepository: CheckoutRepository,
    private readonly bookService: BookService,
  ) {}

  async create(
    user: User,
    { bookId }: CreateCheckoutDto,
  ): Promise<SuccessResponse<Checkout>> {
    const rentingCheckout =
      await this.checkoutRepository.findRentingCheckoutByUserIdAndBookId(
        user.id,
        bookId,
      );

    if (rentingCheckout)
      throw new ConflictException('User has already rented this book.');

    const book = await this.bookService.findOne(bookId);

    if (book.quantity === 0)
      throw new BadRequestException('This book is currently out of stock.');

    const checkout = new Checkout();
    const checkoutTimestamp = new Date();
    const dueTimestamp = new Date(
      checkoutTimestamp.getTime() + this.TWO_WEEKS_AS_MS,
    );

    checkout.user = user;
    checkout.book = book;
    checkout.checkoutTimestamp = checkoutTimestamp;
    checkout.dueTimestamp = dueTimestamp;

    await this.bookService.update(bookId, { quantity: book.quantity - 1 });

    return {
      data: await this.checkoutRepository.save(checkout),
    };
  }

  async findAll(
    checkoutSearchDto: CheckoutSearchDto,
  ): Promise<SuccessResponse<Checkout[]>> {
    const { page, pageSize } = checkoutSearchDto;
    const [checkouts, total] =
      await this.checkoutRepository.findAllAndCount(checkoutSearchDto);
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

  async findAllCheckoutsOfCurrentUser(
    user: User,
    userCheckoutSearchDto: UserCheckoutSearchDto,
  ) {
    const { page, pageSize } = userCheckoutSearchDto;
    const [checkouts, total] = await this.checkoutRepository.findAllAndCount({
      userId: user.id,
      ...userCheckoutSearchDto,
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
}
