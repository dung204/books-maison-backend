import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CATEGORY_ORDERABLE_FIELDS } from '@/modules/category/constants/category-orderable-fields.constant';
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

  async findAll({
    page,
    pageSize,
    orderBy,
    order,
  }: PaginationQueryDto): Promise<SuccessResponse<Category[]>> {
    const skip = (page - 1) * pageSize;
    orderBy = CATEGORY_ORDERABLE_FIELDS.includes(orderBy)
      ? orderBy
      : 'createdTimestamp';
    const [categories, total] = await this.categoryRepository.findAndCount({
      skip,
      take: pageSize,
      order: {
        [orderBy]: order,
      },
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
