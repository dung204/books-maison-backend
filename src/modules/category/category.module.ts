import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from '@/modules/category/controllers';
import { Category } from '@/modules/category/entities';
import { CategoryRepository } from '@/modules/category/repositories';
import { CategoryService } from '@/modules/category/services';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
