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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { SuccessResponse } from '@/base/common/responses';
import { CustomRequest } from '@/base/common/types';
import { Admin, Private } from '@/modules/auth/decorators';
import {
  AdminCreateCheckoutDto,
  CheckoutDto,
  CheckoutSearchDto,
  MarkReturnedCheckoutDto,
  UpdateCheckoutNoteDto,
} from '@/modules/checkout/dtos';
import { CheckoutService } from '@/modules/checkout/services';

@ApiBearerAuth('JWT')
@ApiTags('checkouts')
@Controller('checkouts')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Admin()
  @ApiOperation({
    summary: 'Create a checkout (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: CheckoutDto,
    isArray: false,
    description: 'Successful checkout creation.',
  })
  @ApiBadRequestResponse({
    description: 'Book ID is invalid or the book is out of stock.',
  })
  @ApiConflictResponse({
    description: 'User has already rented this book.',
  })
  @Post('/')
  createCheckoutUsingAdminUser(
    @Body() adminCreateCheckoutDto: AdminCreateCheckoutDto,
  ) {
    return this.checkoutService.createCheckoutUsingAdminUser(
      adminCreateCheckoutDto,
    );
  }

  @Admin()
  @ApiOperation({
    summary: 'Mark a checkout as returned (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: CheckoutDto,
    isArray: false,
    description: 'Checkout is marked as returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
  @ApiConflictResponse({
    description: 'The checkout has already been marked as RETURNED.',
  })
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

  @Admin()
  @ApiOperation({
    summary: 'Update note of a checkout (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: CheckoutDto,
    isArray: false,
    description: 'Checkout note updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
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

  @Admin()
  @ApiOperation({
    summary: 'Get all checkouts (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CheckoutDto,
    isArray: true,
    pagination: true,
    description:
      'Get all checkouts information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() checkoutSearchDto: CheckoutSearchDto) {
    return this.checkoutService.findAll(checkoutSearchDto);
  }

  @Private()
  @ApiOperation({
    summary: 'Get a checkout by ID',
    description:
      'Only ADMIN users and the owner of the checkout are accessible to the checkout',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CheckoutDto,
    isArray: false,
    description: 'Checkout is retrieved successfully.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the checkout.',
  })
  @ApiNotFoundResponse({
    description: 'Checkout not found.',
  })
  @Get(':id')
  async findOne(
    @Request() req: CustomRequest,
    @Param('id') id: string,
  ): Promise<SuccessResponse<CheckoutDto>> {
    const currentUser = req.user;

    return {
      data: CheckoutDto.fromCheckout(
        await this.checkoutService.findOne(currentUser, id),
      ),
    };
  }
}
