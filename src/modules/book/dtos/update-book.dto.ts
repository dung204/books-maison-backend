import { PartialType } from '@nestjs/swagger';

import { CreateBookDto } from '@/modules/book/dtos/create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
