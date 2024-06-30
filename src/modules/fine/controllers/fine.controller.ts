import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineService } from '@/modules/fine/services/fine.service';

import { UpdateFineDto } from '../dto/update-fine.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.fineService.update(+id, updateFineDto);
  }
}
