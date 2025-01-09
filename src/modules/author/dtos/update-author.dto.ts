import { PartialType } from '@nestjs/swagger';

import { CreateAuthorDto } from '@/modules/author/dtos/create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
