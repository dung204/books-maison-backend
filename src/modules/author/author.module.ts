import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorController } from '@/modules/author/controllers/author.controller';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorRepository } from '@/modules/author/repositories/author.repository';
import { AuthorService } from '@/modules/author/services/author.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
  exports: [AuthorService],
})
export class AuthorModule {}
