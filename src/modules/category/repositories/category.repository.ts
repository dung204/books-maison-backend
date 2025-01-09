import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import {
  CategorySearchDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/modules/category/dtos';
import { Category } from '@/modules/category/entities';
import { CategoryOrderableField } from '@/modules/category/enums';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  findAllAndCount({
    page,
    pageSize,
    orderBy,
    order,
    deletedOnly,
    name,
  }: CategorySearchDto) {
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(CategoryOrderableField).includes(
      orderBy,
    )
      ? orderBy
      : CategoryOrderableField.CREATED_TIMESTAMP;
    const query = this.createQueryBuilder('category')
      .orderBy(`category.${actualOrderBy}`, order)
      .skip(skip)
      .take(pageSize);

    if (deletedOnly) {
      query.withDeleted().andWhere('category.deletedTimestamp IS NOT NULL');
    }

    if (name) {
      query.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    return query.getManyAndCount();
  }

  findById(id: string) {
    return this.findOneBy({ id });
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = new Category();
    Object.assign(category, createCategoryDto);
    await this.save(category);
    return category;
  }

  isExistedById(id: string) {
    return this.existsBy({ id });
  }

  async updateCategoryById(id: string, updateCategoryDto: UpdateCategoryDto) {
    const updateResult = await this.update({ id }, updateCategoryDto);

    return updateResult.affected;
  }
}
