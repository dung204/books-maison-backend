import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorRepository } from '@/modules/author/repositories/author.repository';

import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @Inject(AuthorRepository) private authorRepository: AuthorRepository,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    createAuthorDto;
    return 'This action adds a new author';
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<Author[]>> {
    const { page, pageSize } = paginationQueryDto;
    const skip = (page - 1) * pageSize;
    const [authors, total] = await this.authorRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: authors,
      pagination: {
        total,
        page,
        pageSize,
        totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    updateAuthorDto;
    return `This action updates a #${id} author`;
  }

  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}
