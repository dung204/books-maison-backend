import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from '@/modules/category/controllers/category.controller';
import { Category } from '@/modules/category/entities/category.entity';
import { CategoryRepository } from '@/modules/category/repositories/category.repository';
import { CategoryService } from '@/modules/category/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
