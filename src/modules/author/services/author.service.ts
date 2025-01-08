import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { AuthorSearchDto } from '@/modules/author/dto/author-search.dto';
import { AuthorRepository } from '@/modules/author/repositories/author.repository';

import { AuthorDto } from '../dto/author.dto';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class AuthorService {
  private readonly logger: Logger = new Logger(AuthorService.name);

  constructor(
    @Inject(AuthorRepository)
    private readonly authorRepository: AuthorRepository,
  ) {}

  async create(
    createAuthorDto: CreateAuthorDto,
  ): Promise<SuccessResponse<AuthorDto>> {
    const author = await this.authorRepository.createAuthor(createAuthorDto);

    return {
      data: AuthorDto.fromAuthor(author),
    };
  }

  async findAll(
    authorSearchDto: AuthorSearchDto,
  ): Promise<SuccessResponse<AuthorDto[]>> {
    const { page, pageSize } = authorSearchDto;
    const [authors, total] =
      await this.authorRepository.findAllAndCount(authorSearchDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: authors.map(AuthorDto.fromAuthor),
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

  async findAllDeletedOnly(authorSearchDto: AuthorSearchDto) {
    return this.findAll({ ...authorSearchDto, deletedOnly: true });
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

  async softDeleteAuthor(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
    });

    if (!author)
      throw new NotFoundException(
        'Author is not found or has already been deleted.',
      );

    await this.authorRepository.softRemove(author);
  }

  async recoverAuthor(id: string): Promise<SuccessResponse<AuthorDto>> {
    const author = await this.authorRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!author)
      throw new NotFoundException(
        'Author is not found or has already been deleted.',
      );

    return {
      data: AuthorDto.fromAuthor(await this.authorRepository.recover(author)),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteAuthors() {
    const deleteResult = await this.authorRepository
      .createQueryBuilder()
      .delete()
      .where('(CURRENT_TIMESTAMP::date - deletedTimestamp ::date) >= 30')
      .execute();

    this.logger.log(
      `${deleteResult.affected} authors have been deleted successfully.`,
    );
  }
}
