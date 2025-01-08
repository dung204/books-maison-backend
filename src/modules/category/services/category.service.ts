import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { CategorySearchDto } from '@/modules/category/dto/category-search.dto';
import { CategoryDto } from '@/modules/category/dto/category.dto';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name);

  constructor(private categoryRepository: CategoryRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<SuccessResponse<CategoryDto>> {
    const category =
      await this.categoryRepository.createCategory(createCategoryDto);

    return {
      data: CategoryDto.fromCategory(category),
    };
  }

  async findAll(
    categorySearchDto: CategorySearchDto,
  ): Promise<SuccessResponse<CategoryDto[]>> {
    const { page, pageSize } = categorySearchDto;
    const [categories, total] =
      await this.categoryRepository.findAllAndCount(categorySearchDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: categories.map(CategoryDto.fromCategory),
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

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category)
      throw new NotFoundException(
        'Category is not found or has already been marked as deleted.',
      );

    await this.categoryRepository.softRemove(category);
  }

  async recoverCategory(id: string): Promise<SuccessResponse<CategoryDto>> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!category)
      throw new NotFoundException(
        'Category is not found or has already been marked as deleted.',
      );

    return {
      data: CategoryDto.fromCategory(
        await this.categoryRepository.softRemove(category),
      ),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteCategories() {
    const deleteResult = await this.categoryRepository
      .createQueryBuilder()
      .delete()
      .where('(CURRENT_TIMESTAMP::date - deletedTimestamp ::date) >= 30')
      .execute();

    this.logger.log(
      `${deleteResult.affected} categories have been deleted successfully.`,
    );
  }
}
