import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateCategoryDto } from '@/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '@/modules/category/dto/update-category.dto';
import { Category } from '@/modules/category/entities/category.entity';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
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
