import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Author } from '@/modules/author/entities/author.entity';

import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
