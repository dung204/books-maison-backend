import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '@/modules/author';
import { BookController } from '@/modules/book/controllers';
import { Book } from '@/modules/book/entities';
import { BookRepository } from '@/modules/book/repositories';
import { BookService } from '@/modules/book/services';
import { CategoryModule } from '@/modules/category';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), CategoryModule, AuthorModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookService],
})
export class BookModule {}
