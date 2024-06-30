import {
  Controller,
  Get,
  HttpStatus,
  Param,
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
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineService } from '@/modules/fine/services/fine.service';

@ApiBearerAuth('JWT')
@ApiTags('fines')
@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @ApiOperation({
    summary: 'Get all fines',
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
    summary: 'Get a checkout by ID',
    description:
      'Only ADMIN users and the owner of the fine are accessible to the checkout',
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
}
