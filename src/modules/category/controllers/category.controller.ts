import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Category } from '@/modules/category/entities/category.entity';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a new categories (for ADMIN only)',
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Category,
    isArray: false,
    description: 'Successful category creation',
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
  @Post('/')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Category,
    isArray: true,
    pagination: true,
    description:
      'Get all categories information successfully (with pagination metadata).',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get('/')
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.categoryService.findAll(paginationQueryDto);
  }

  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Category,
    isArray: false,
    description: 'Category is retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category is not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update a category by ID (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Category,
    isArray: false,
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
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }
}