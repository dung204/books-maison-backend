import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { AuthorSearchDto } from '@/modules/author/dto/author-search.dto';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorRepository } from '@/modules/author/repositories/author.repository';

import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @Inject(AuthorRepository) private authorRepository: AuthorRepository,
  ) {}

  async create(
    createAuthorDto: CreateAuthorDto,
  ): Promise<SuccessResponse<Author>> {
    const author = await this.authorRepository.createAuthor(createAuthorDto);

    return {
      data: author,
    };
  }

  async findAll(
    authorSearchDto: AuthorSearchDto,
  ): Promise<SuccessResponse<Author[]>> {
    const { page, pageSize } = authorSearchDto;
    const [authors, total] =
      await this.authorRepository.findAllAndCount(authorSearchDto);
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

  async findAuthorById(id: string) {
    const author = await this.authorRepository.findById(id);

    if (!author) throw new NotFoundException('Author not found!');

    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    if (!this.authorRepository.isExistedById(id))
      throw new NotFoundException('Author not found.');

    const updateStatus = await this.authorRepository.updateAuthorById(
      id,
      updateAuthorDto,
    );
    if (updateStatus !== 1)
      throw new ConflictException('Conflicted! Cannot update author.');

    return this.authorRepository.findById(id);
  }
}
