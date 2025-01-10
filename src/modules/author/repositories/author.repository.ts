import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { rawToEntity } from '@/base/utils';
import {
  AuthorSearchDto,
  CreateAuthorDto,
  UpdateAuthorDto,
} from '@/modules/author/dtos';
import { Author } from '@/modules/author/entities';
import { AuthorOrderableField } from '@/modules/author/enums';

@Injectable()
export class AuthorRepository extends Repository<Author> {
  constructor(private dataSource: DataSource) {
    super(Author, dataSource.createEntityManager());
  }

  async findAllAndCount({
    page,
    pageSize,
    order,
    orderBy,
    deletedOnly,
    name,
    nationality,
    yearOfBirthFrom,
    yearOfBirthTo,
    yearOfDeathFrom,
    yearOfDeathTo,
  }: AuthorSearchDto) {
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(AuthorOrderableField).includes(orderBy)
      ? orderBy
      : AuthorOrderableField.CREATED_TIMESTAMP;
    const query = this.createQueryBuilder('author')
      .orderBy(`author.${actualOrderBy}`, order)
      .skip(skip)
      .take(pageSize);

    if (deletedOnly) {
      query.withDeleted().andWhere('author.deletedTimestamp IS NOT NULL');
    }

    if (name) {
      query.andWhere('LOWER(author.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    if (nationality) {
      query.andWhere('LOWER(author.nationality) LIKE LOWER(:nationality)', {
        nationality: `%${nationality}%`,
      });
    }

    if (yearOfBirthFrom) {
      query.andWhere('author.yearOfBirth >= :yearOfBirthFrom', {
        yearOfBirthFrom,
      });
    }

    if (yearOfBirthTo) {
      query.andWhere('author.yearOfBirth <= :yearOfBirthTo', { yearOfBirthTo });
    }

    if (yearOfDeathFrom) {
      query.andWhere('author.yearOfDeath >= :yearOfDeathFrom', {
        yearOfDeathFrom,
      });
    }

    if (yearOfDeathTo) {
      query.andWhere('author.yearOfDeath <= :yearOfDeathTo', { yearOfBirthTo });
    }

    return query.getManyAndCount();
  }

  findById(id: string) {
    return this.findOneBy({ id });
  }

  isExistedById(id: string) {
    return this.existsBy({ id });
  }

  async createAuthor(createAuthorDto: CreateAuthorDto) {
    const author = new Author();
    Object.assign(author, createAuthorDto);
    await this.save(author);
    return author;
  }

  async updateAuthorById(
    id: string,
    {
      biography,
      imageUrl,
      name,
      nationality,
      yearOfBirth,
      yearOfDeath,
    }: UpdateAuthorDto,
  ) {
    try {
      const updateQuery = this.createQueryBuilder()
        .update()
        .set({
          ...(biography && { biography: () => `'${biography}'` }),
          ...(imageUrl && { imageUrl: () => `'${imageUrl}'` }),
          ...(name && { name: () => `'${name}'` }),
          ...(nationality && { nationality: () => `'${nationality}'` }),
          ...(yearOfBirth && { yearOfBirth: () => `${yearOfBirth}` }),
          ...(yearOfDeath && { yearOfDeath: () => `'${yearOfDeath}'` }),
        })
        .where(`id = '${id}'`)
        .returning('*')
        .getQuery();

      const selectQuery = this.createQueryBuilder('author')
        .getQuery()
        .replaceAll(`"public"."authors"`, `"updated_authors"`);

      const rawUpdatedAuthors = (await this.query(
        `WITH "updated_authors" AS (${updateQuery}) ${selectQuery}`,
      )) as any[];

      if (rawUpdatedAuthors.length === 0) return null;

      const author = rawToEntity(Author, rawUpdatedAuthors[0], 'author');

      return author;
    } catch (err) {
      return null;
    }
  }
}
