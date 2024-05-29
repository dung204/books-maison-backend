import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Category } from '@/modules/category/entities/category.entity';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepository) private categoryRepository: CategoryRepository,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<SuccessResponse<Category>> {
    const category =
      await this.categoryRepository.createCategory(createCategoryDto);

    return {
      data: category,
    };
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<Category[]>> {
    const { page, pageSize } = paginationQueryDto;
    const skip = (page - 1) * pageSize;
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: categories,
      pagination: {
        total,
        page,
        pageSize,
        totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findCategoryById(id: string): Promise<SuccessResponse<Category>> {
    const category = await this.categoryRepository.findById(id);

    if (!category) throw new NotFoundException('Category not found.');

    return {
      data: category,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<SuccessResponse<Category>> {
    if (!this.categoryRepository.isExistedById(id))
      throw new NotFoundException('Category not found.');

    const updateStatus = await this.categoryRepository.updateCategoryById(
      id,
      updateCategoryDto,
    );
    if (updateStatus !== 1)
      throw new ConflictException('Conflicted! Cannot update category.');

    return {
      data: await this.categoryRepository.findById(id),
    };
  }
}
