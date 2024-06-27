import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
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
import { AdminCreateCheckoutDto } from '@/modules/checkout/dto/admin-create-checkout.dto';
import { CheckoutSearchDto } from '@/modules/checkout/dto/checkout-search.dto';
import { MarkReturnedCheckoutDto } from '@/modules/checkout/dto/mark-returned-checkout.dto';
import { UpdateCheckoutNoteDto } from '@/modules/checkout/dto/update-checkout-note.dto';
import { UserCheckoutSearchDto } from '@/modules/checkout/dto/user-checkout-search.dto';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutService } from '@/modules/checkout/services/checkout.service';

import { UserCreateCheckoutDto } from '../dto/user-create-checkout.dto';

@ApiBearerAuth('JWT')
@ApiTags('checkouts')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiOperation({
    summary: 'Create a checkout (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Checkout,
    isArray: false,
    description: 'Successful checkout creation.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiBadRequestResponse({
    description: 'Book ID is invalid or the book is out of stock.',
  })
  @ApiConflictResponse({
    description: 'User has already rented this book.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Post('/')
  createCheckoutUsingAdminUser(
    @Body() adminCreateCheckoutDto: AdminCreateCheckoutDto,
  ) {
    return this.checkoutService.createCheckoutUsingAdminUser(
      adminCreateCheckoutDto,
    );
  }

  @ApiOperation({
    summary: 'Mark a checkout as returned (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Checkout,
    isArray: false,
    description: 'Checkout is marked as returned successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
  @ApiConflictResponse({
    description: 'The checkout has already been marked as RETURNED.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Patch('/return/:id')
  markCheckoutAsReturned(
    @Body() markReturnedCheckoutDto: MarkReturnedCheckoutDto,
    @Param('id') checkoutId: string,
  ) {
    return this.checkoutService.markCheckoutAsReturned(
      checkoutId,
      markReturnedCheckoutDto,
    );
  }

  @ApiOperation({
    summary: 'Update note of a checkout (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Checkout,
    isArray: false,
    description: 'Checkout note updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Patch('/note/:id')
  updateCheckoutNote(
    @Param('id') checkoutId: string,
    @Body() updateCheckoutNoteDto: UpdateCheckoutNoteDto,
  ) {
    return this.checkoutService.updateCheckoutNote(
      checkoutId,
      updateCheckoutNoteDto,
    );
  }

  @ApiOperation({
    summary: 'Create a checkout (for current authenticated user)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Checkout,
    isArray: false,
    description: 'Successful checkout creation.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiBadRequestResponse({
    description: 'Book ID is invalid or the book is out of stock.',
  })
  @ApiConflictResponse({
    description: 'User has already rented this book.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Post('/me')
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

  @ApiOperation({
    summary: 'Get all checkouts (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Checkout,
    isArray: true,
    pagination: true,
    description:
      'Get all checkouts information successfully (with pagination metadata).',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Get('/')
  findAll(@Query() checkoutSearchDto: CheckoutSearchDto) {
    return this.checkoutService.findAll(checkoutSearchDto);
  }

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
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get('/me')
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

  @ApiOperation({
    summary: 'Get a checkout by ID',
    description:
      'Only ADMIN users and the owner of the checkout are accessible to the checkout',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Checkout,
    isArray: false,
    description: 'Checkout is retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the checkout.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get(':id')
  async findOne(
    @Request() req: CustomRequest,
    @Param('id') id: string,
  ): Promise<SuccessResponse<Checkout>> {
    const currentUser = req.user;

    return {
      data: await this.checkoutService.findOne(currentUser, id),
    };
  }
}
