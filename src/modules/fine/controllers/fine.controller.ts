import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
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
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { PayFineDto } from '@/modules/fine/dto/pay-fine.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineService } from '@/modules/fine/services/fine.service';

@ApiBearerAuth('JWT')
@ApiTags('fines')
@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @ApiOperation({
    summary: 'Get all fines (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Fine,
    isArray: true,
    pagination: true,
    description:
      'Get all fines information successfully (with pagination metadata).',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
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
    return this.fineService.findAll(paginationQueryDto);
  }

  @ApiOperation({
    summary: 'Get a fine by ID',
    description:
      'Only ADMIN users and the owner of the fine are accessible to the fine',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Fine,
    isArray: false,
    description: 'Fine is retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the fine.',
  })
  @ApiNotFoundResponse({
    description: 'Fine not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get(':id')
  findOne(@Request() req: CustomRequest, @Param('id') id: string) {
    const currentUser = req.user;
    return this.fineService.findOne(currentUser, id);
  }

  @ApiOperation({
    summary: 'Pay fine',
    description:
      '- This route only creates a money transaction to pay the fine. The fine will **NOT** be marked as `PAID` immediately (since money transactions might fail), but it definitely will when the corresponding money transaction is saved to the database successfully.\n\n- If using `CASH` method, the current authenticated user must be an `ADMIN`.',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Fine,
    isArray: false,
    description: 'A money transaction to pay the fine is created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required.',
  })
  @ApiForbiddenResponse({
    description:
      'The purchase method is `CASH` and the current authenticated user is not an `ADMIN`.',
  })
  @ApiNotFoundResponse({
    description: 'Fine not found.',
  })
  @ApiConflictResponse({
    description:
      '- The checkout corresponding to this fine is not marked `RETURNED`.\n\n- Fine is already paid or cancelled.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Patch('/pay/:id')
  payFine(
    @Request() req: CustomRequest,
    @Param('id') fineId: string,
    @Body() payFineDto: PayFineDto,
  ) {
    const currentUser = req.user;
    return this.fineService.handlePayFine(currentUser, fineId, payFineDto);
  }
}
