import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorModule } from '@/modules/author/author.module';
import { BookController } from '@/modules/book/controllers/book.controller';
import { Book } from '@/modules/book/entities/book.entity';
import { BookRepository } from '@/modules/book/repositories/book.repository';
import { BookService } from '@/modules/book/services/book.service';
import { CategoryModule } from '@/modules/category/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), CategoryModule, AuthorModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookService],
})
export class BookModule {}
