import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { SuccessResponse } from '@/base/common/responses';
import { Admin, Public } from '@/modules/auth/decorators';
import {
  CategoryDto,
  CategorySearchDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/modules/category/dtos';
import { CategoryService } from '@/modules/category/services';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Admin()
  @ApiOperation({
    summary: 'Create a new categories (for ADMIN only)',
  })
  @ApiBody({
    type: CreateCategoryDto,
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: CategoryDto,
    isArray: false,
    description: 'Successful category creation',
  })
  @Post('/')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CategoryDto,
    isArray: true,
    pagination: true,
    description:
      'Get all categories information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() categorySearchDto: CategorySearchDto) {
    return this.categoryService.findAll(categorySearchDto);
  }

  @Admin()
  @ApiOperation({
    summary: 'Get all deleted categories (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CategoryDto,
    isArray: true,
    pagination: true,
    description:
      'Get all deleted categories information successfully (with pagination metadata).',
  })
  @Get('/deleted')
  findAllDeletedOnly(@Query() categorySearchDto: CategorySearchDto) {
    return this.categoryService.findAllDeletedOnly(categorySearchDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get a category by ID',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CategoryDto,
    isArray: false,
    description: 'Category is retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Category is not found.',
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponse<CategoryDto>> {
    return {
      data: CategoryDto.fromCategory(
        await this.categoryService.findCategoryById(id),
      ),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Update a category by ID (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CategoryDto,
    isArray: false,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<SuccessResponse<CategoryDto>> {
    return {
      data: CategoryDto.fromCategory(
        await this.categoryService.update(id, updateCategoryDto),
      ),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Mark an category as deleted (for ADMIN only)',
  })
  @ApiNoContentResponse({
    description: 'The category is marked as deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'The category is not found or has already marked as deleted',
  })
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Admin()
  @ApiOperation({
    summary: 'Recover an category from the deleted (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: CategoryDto,
    isArray: false,
    description: 'The category is marked as deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'The category is not found or has already marked as deleted',
  })
  @Patch('/recover/:id')
  async recovercategory(@Param('id') id: string) {
    return this.categoryService.recoverCategory(id);
  }
}
