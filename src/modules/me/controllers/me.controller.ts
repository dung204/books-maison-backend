import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { Private } from '@/modules/auth/decorators/private.decorator';
import { Book } from '@/modules/book/entities/book.entity';
import { UserCheckoutSearchDto } from '@/modules/checkout/dto/user-checkout-search.dto';
import { UserCreateCheckoutDto } from '@/modules/checkout/dto/user-create-checkout.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutService } from '@/modules/checkout/services/checkout.service';
import { FavouriteBookSearchDto } from '@/modules/favourite-book/dto/favourite-book-search.dto';
import { FavouriteBookService } from '@/modules/favourite-book/services/favourite-book.service';
import { FineDto } from '@/modules/fine/dto/fine.dto';
import UserFineSearchDto from '@/modules/fine/dto/user-fine-search.dto';
import { FineService } from '@/modules/fine/services/fine.service';
import { UserTransactionSearchDto } from '@/modules/transaction/dto/user-transaction-search.dto';
import { Transaction } from '@/modules/transaction/entities/transaction.entity';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { ChangePasswordDto } from '@/modules/user/dto/change-password.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { UpdateProfileRequest } from '@/modules/user/requests/update-profile.request';
import { UserService } from '@/modules/user/services/user.service';

@ApiTags('me')
@Controller('/me')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly favouriteBookService: FavouriteBookService,
    private readonly checkoutService: CheckoutService,
    private readonly fineService: FineService,
    private readonly transactionService: TransactionService,
  ) {}

  @Private()
  @ApiOperation({ summary: 'Get profile of current user' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
  })
  @Get('/profile')
  async getCurrentUserProfile(
    @Request() req: CustomRequest,
  ): Promise<SuccessResponse<UserDto>> {
    return {
      data: UserDto.fromUser(req.user),
    };
  }

  @Private()
  @ApiOperation({ summary: 'Update profile of current user' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
    description: 'Profile is updated successfully',
  })
  @ApiBadRequestResponse({
    description: 'Update information is invalid',
  })
  @Patch('/profile')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUserProfile(
    @Request() req: CustomRequest,
    @Body() updateProfileRequest: UpdateProfileRequest,
  ) {
    const currentUser = req.user;
    return this.userService.update(currentUser.id, updateProfileRequest);
  }

  @Private()
  @ApiOperation({ summary: 'Change the password of current user' })
  @ApiNoContentResponse({ description: 'Password is changed successfully' })
  @ApiUnauthorizedResponse({
    description: `- User login is required\n\n- The old password mismatches with the current password`,
  })
  @ApiConflictResponse({
    description: 'Conflicted',
  })
  @Patch('/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePasswordOfCurrentUser(
    @Request() req: CustomRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const currentUser = req.user;
    return this.userService.changePassword(currentUser, changePasswordDto);
  }

  @Private()
  @ApiOperation({
    summary: 'Get all favourite books of the current user',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Book,
    isArray: true,
    pagination: true,
    description:
      'Get all favourite books information successfully (with pagination metadata)',
  })
  @Get('/favourite-books')
  getAllFavouriteBooks(
    @Request() req: CustomRequest,
    @Query() favouriteBookSearchDto: FavouriteBookSearchDto,
  ) {
    const currentUser = req.user;
    return this.favouriteBookService.getAllFavouriteBooks(
      currentUser,
      favouriteBookSearchDto,
    );
  }

  @Private()
  @ApiOperation({
    summary: 'Get all checkouts of the current authenticated user',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Checkout,
    isArray: true,
    pagination: true,
    description:
      'Get all checkouts information successfully (with pagination metadata).',
  })
  @Get('/checkouts')
  findAllCheckoutsOfCurrentUser(
    @Request() req: CustomRequest,
    @Query() userCheckoutSearchDto: UserCheckoutSearchDto,
  ) {
    const currentUser = req.user;
    return this.checkoutService.findAllCheckoutsOfCurrentUser(
      currentUser,
      userCheckoutSearchDto,
    );
  }

  @Private()
  @ApiOperation({
    summary: 'Create a checkout (for current authenticated user)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Checkout,
    isArray: false,
    description: 'Successful checkout creation.',
  })
  @ApiBadRequestResponse({
    description: 'Book ID is invalid or the book is out of stock.',
  })
  @ApiConflictResponse({
    description: 'User has already rented this book.',
  })
  @Post('/checkouts')
  createCheckoutUsingCurrentUser(
    @Request() req: CustomRequest,
    @Body() userCreateCheckoutDto: UserCreateCheckoutDto,
  ) {
    const currentUser = req.user;
    return this.checkoutService.createCheckoutUsingCurrentUser(
      currentUser,
      userCreateCheckoutDto,
    );
  }

  @Private()
  @ApiOperation({
    summary: 'Get all fines of the current authenticated user',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: FineDto,
    isArray: false,
    pagination: true,
    description: 'Get all fines successfully (with pagination metadata).',
  })
  @Get('/fines')
  findAllFinesOfCurrentUser(
    @Request() req: CustomRequest,
    @Query() userFineSearchDto: UserFineSearchDto,
  ) {
    const currentUser = req.user;
    return this.fineService.findAllFinesOfCurrentUser(
      currentUser,
      userFineSearchDto,
    );
  }

  @Private()
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
  @Get('/transactions')
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
}
