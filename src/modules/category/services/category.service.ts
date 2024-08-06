import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { CategorySearchDto } from '@/modules/category/dto/category-search.dto';
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
    categorySearchDto: CategorySearchDto,
  ): Promise<SuccessResponse<Category[]>> {
    const { page, pageSize } = categorySearchDto;
    const [categories, total] =
      await this.categoryRepository.findAllAndCount(categorySearchDto);
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

  async findCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);

    if (!category) throw new NotFoundException('Category not found.');

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!this.categoryRepository.isExistedById(id))
      throw new NotFoundException('Category not found.');

    const updateStatus = await this.categoryRepository.updateCategoryById(
      id,
      updateCategoryDto,
    );
    if (updateStatus !== 1)
      throw new ConflictException('Conflicted! Cannot update category.');

    return this.categoryRepository.findById(id);
  }
}
