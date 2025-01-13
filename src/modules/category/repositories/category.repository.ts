import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { rawToEntity } from '@/base/utils';
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
    try {
      await this.query(`BEGIN TRANSACTION`);

      const selectQuery = this.createQueryBuilder('category');

      const updatedValues = {
        ...(updateCategoryDto.name && { name: () => '' }),
      };

      if (Object.keys(updatedValues).length === 0) {
        await this.query('COMMIT');
        return selectQuery.where('category.id = :id', { id }).getOne();
      }

      Object.keys(updatedValues).forEach((key, index) => {
        updatedValues[key as keyof typeof updatedValues] = () =>
          `$${index + 1}`;
      });

      const parameters = Object.keys(updatedValues).map(
        (key) => updateCategoryDto[key as keyof typeof updateCategoryDto],
      );

      const updateQuery = this.createQueryBuilder()
        .update()
        .set(updatedValues)
        .where(`id = $${Object.keys(updatedValues).length + 1}`)
        .returning('*')
        .getQuery();

      const rawUpdatedCategories = (await this.query(
        `WITH "updated_categories" AS (${updateQuery}) ${selectQuery
          .getQuery()
          .replaceAll(`"public"."categories"`, `"updated_categories"`)}`,
        [...parameters, id],
      )) as any[];
      await this.query(`COMMIT`);

      if (rawUpdatedCategories.length === 0) return null;

      return rawToEntity(Category, rawUpdatedCategories[0], 'category');
    } catch (err) {
      await this.query(`ROLLBACK`);
      return null;
    }
  }
}
