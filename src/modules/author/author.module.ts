import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthorController } from '@/modules/author/controllers';
import { Author } from '@/modules/author/entities';
import { AuthorRepository } from '@/modules/author/repositories';
import { AuthorService } from '@/modules/author/services';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AuthorController],
  providers: [AuthorService, AuthorRepository],
  exports: [AuthorService],
})
export class AuthorModule {}
