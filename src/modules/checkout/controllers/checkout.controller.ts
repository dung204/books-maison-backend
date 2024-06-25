import {
  Body,
  Controller,
  Delete,
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
  ApiBearerAuth,
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
import { UpdateCheckoutDto } from '../dto/update-checkout.dto';

@ApiBearerAuth('JWT')
@ApiTags('checkouts')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  create(@Body() createCheckoutDto: CreateCheckoutDto) {
    return this.checkoutService.create(createCheckoutDto);
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
      'Get all books information successfully (with pagination metadata).',
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckoutDto: UpdateCheckoutDto,
  ) {
    return this.checkoutService.update(+id, updateCheckoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkoutService.remove(+id);
  }
}
