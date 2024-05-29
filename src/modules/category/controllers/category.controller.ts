import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { Category } from '@/modules/category/entities/category.entity';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryService } from '../services/category.service';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
}
