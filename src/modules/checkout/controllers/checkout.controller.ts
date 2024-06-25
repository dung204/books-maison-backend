import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
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
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { CheckoutService } from '@/modules/checkout/services/checkout.service';

import { CreateCheckoutDto } from '../dto/create-checkout.dto';

@ApiBearerAuth('JWT')
@ApiTags('checkouts')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiOperation({
    summary: 'Create a checkout',
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
  @Post('/')
  create(
    @Request() req: CustomRequest,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    const currentUser = req.user;
    return this.checkoutService.create(currentUser, createCheckoutDto);
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
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.checkoutService.findAll(paginationQueryDto);
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
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    const currentUser = req.user;
    return this.checkoutService.findAllCheckoutsOfCurrentUser(
      currentUser,
      paginationQueryDto,
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
