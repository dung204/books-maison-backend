import { PartialType } from '@nestjs/swagger';

import { CreateCategoryDto } from '@/modules/category/dtos/create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
