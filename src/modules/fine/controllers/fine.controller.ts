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
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { Admin } from '@/modules/auth/decorators/admin.decorator';
import { Private } from '@/modules/auth/decorators/private.decorator';
import { FineSearchDto } from '@/modules/fine/dto/fine-search.dto';
import { FineDto } from '@/modules/fine/dto/fine.dto';
import { PayFineDto } from '@/modules/fine/dto/pay-fine.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';
import { FineService } from '@/modules/fine/services/fine.service';
import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';

@ApiTags('fines')
@Controller('fines')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Admin()
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
  @Get('/')
  findAll(@Query() fineSearchDto: FineSearchDto) {
    return this.fineService.findAll(fineSearchDto);
  }

  @Private()
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
  @ApiForbiddenResponse({
    description:
      'The current authenticated user is not an ADMIN nor the owner of the fine.',
  })
  @ApiNotFoundResponse({
    description: 'Fine not found.',
  })
  @Get(':id')
  findOne(@Request() req: CustomRequest, @Param('id') id: string) {
    const currentUser = req.user;
    return this.fineService.findOne(currentUser, id);
  }

  @Private()
  @ApiOperation({
    summary: 'Pay fine',
    description: `- This route only creates a money transaction to pay the fine. The fine will **NOT** be marked as \`${FineStatus.PAID}\` immediately (since money transactions might fail). However, the fine will certainly be marked as \`${FineStatus.PAID}\` when the corresponding money transaction is saved to the database successfully.\n\n- If using \`${TransactionMethod.CASH}\` method, the current authenticated user must be an \`ADMIN\`.`,
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Fine,
    isArray: false,
    description: 'A money transaction to pay the fine is created successfully.',
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
  @Post('/pay/:id')
  payFine(
    @Request() req: CustomRequest,
    @Param('id') fineId: string,
    @Body() payFineDto: PayFineDto,
  ) {
    const currentUser = req.user;
    return this.fineService.handlePayFine(currentUser, fineId, payFineDto);
  }

  @Admin()
  @ApiOperation({
    summary: 'Cancel a fine (for ADMIN only)',
    description: `A fine will be marked as \`${FineStatus.CANCELLED}\` if the status of the fine is \`${FineStatus.ISSUED}\``,
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: FineDto,
    isArray: false,
    description: `Fine is marked as \`${FineStatus.CANCELLED}\` successfully.`,
  })
  @ApiNotFoundResponse({
    description: 'Fine not found.',
  })
  @ApiConflictResponse({
    description: `The fine status is not \`${FineStatus.ISSUED}\``,
  })
  @Patch('/cancel/:id')
  cancelFine(@Param('id') id: string) {
    return this.fineService.cancelFine(id);
  }
}
