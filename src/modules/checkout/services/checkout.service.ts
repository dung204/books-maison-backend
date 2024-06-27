import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Role } from '@/base/common/enum/role.enum';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { BookService } from '@/modules/book/services/book.service';
import { AdminCreateCheckoutDto } from '@/modules/checkout/dto/admin-create-checkout.dto';
import { CheckoutSearchDto } from '@/modules/checkout/dto/checkout-search.dto';
import { MarkReturnedCheckoutDto } from '@/modules/checkout/dto/mark-returned-checkout.dto';
import { UpdateCheckoutNoteDto } from '@/modules/checkout/dto/update-checkout-note.dto';
import { UserCheckoutSearchDto } from '@/modules/checkout/dto/user-checkout-search.dto';
import { UserCreateCheckoutDto } from '@/modules/checkout/dto/user-create-checkout.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutStatus } from '@/modules/checkout/enum/checkout-status.enum';
import { CheckoutRepository } from '@/modules/checkout/repositories/checkout.repository';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class CheckoutService {
  private readonly TWO_WEEKS_AS_MS = 1_209_600_000;
  private readonly logger: Logger = new Logger(CheckoutService.name);

  constructor(
    private readonly checkoutRepository: CheckoutRepository,
    private readonly bookService: BookService,
    private readonly userService: UserService,
  ) {}

  async createCheckoutUsingCurrentUser(
    user: User,
    { bookId }: UserCreateCheckoutDto,
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

    checkout.user = UserDto.fromUser(user);
    checkout.book = await this.bookService.update(bookId, {
      quantity: book.quantity - 1,
    });
    checkout.checkoutTimestamp = checkoutTimestamp;
    checkout.dueTimestamp = dueTimestamp;

    return {
      data: await this.checkoutRepository.save(checkout),
    };
  }

  async createCheckoutUsingAdminUser({
    userId,
    bookId,
  }: AdminCreateCheckoutDto) {
    const rentingCheckout =
      await this.checkoutRepository.findRentingCheckoutByUserIdAndBookId(
        userId,
        bookId,
      );

    if (rentingCheckout)
      throw new ConflictException('User has already rented this book.');

    const user = await this.userService.findUserById(userId);
    const book = await this.bookService.findOne(bookId);

    if (book.quantity === 0)
      throw new BadRequestException('This book is currently out of stock.');

    const checkout = new Checkout();
    const checkoutTimestamp = new Date();
    const dueTimestamp = new Date(
      checkoutTimestamp.getTime() + this.TWO_WEEKS_AS_MS,
    );

    checkout.user = UserDto.fromUser(user);
    checkout.book = await this.bookService.update(bookId, {
      quantity: book.quantity - 1,
    });
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

  async markCheckoutAsReturned(
    checkoutId: string,
    markReturnedCheckoutDto: MarkReturnedCheckoutDto,
  ): Promise<SuccessResponse<Checkout>> {
    const checkout = await this.checkoutRepository.findById(checkoutId);

    if (!checkout) throw new NotFoundException('Checkout not found.');

    if (checkout.status === CheckoutStatus.RETURNED)
      throw new ConflictException(
        'This checkout is already marked as RETURNED.',
      );

    const book = checkout.book;
    checkout.book = await this.bookService.update(book.id, {
      ...book,
      quantity: book.quantity + 1,
    });

    checkout.status = CheckoutStatus.RETURNED;
    checkout.note = markReturnedCheckoutDto.note;
    checkout.returnedTimestamp = new Date();

    return {
      data: await this.checkoutRepository.save(checkout),
    };
  }

  async updateCheckoutNote(
    checkoutId: string,
    { note }: UpdateCheckoutNoteDto,
  ) {
    const checkout = await this.checkoutRepository.findById(checkoutId);

    if (!checkout) throw new NotFoundException('Checkout not found.');

    checkout.note = note;
    return {
      data: await this.checkoutRepository.save(checkout),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async setOverdueCheckouts() {
    const checkouts: Checkout[] = (
      await this.checkoutRepository.getRentingCheckoutsDueBeforeToday()
    ).map((checkout) => ({ ...checkout, status: CheckoutStatus.OVERDUE }));

    await this.checkoutRepository.save(checkouts);
    this.logger.log(`${checkouts.length} checkouts have been set as overdue.`);
  }
}
