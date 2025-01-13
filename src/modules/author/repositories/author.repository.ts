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

  async updateAuthorById(id: string, updateAuthorDto: UpdateAuthorDto) {
    try {
      await this.query(`BEGIN TRANSACTION`);

      const selectQuery = this.createQueryBuilder('author');

      const updatedValues = {
        ...(updateAuthorDto.biography !== undefined && { biography: () => '' }),
        ...(updateAuthorDto.imageUrl !== undefined && { imageUrl: () => '' }),
        ...(updateAuthorDto.name !== undefined && { name: () => '' }),
        ...(updateAuthorDto.nationality !== undefined && {
          nationality: () => '',
        }),
        ...(updateAuthorDto.yearOfBirth !== undefined && {
          yearOfBirth: () => '',
        }),
        ...(updateAuthorDto.yearOfDeath !== undefined && {
          yearOfDeath: () => '',
        }),
      };

      if (Object.keys(updatedValues).length === 0) {
        await this.query('COMMIT');
        return selectQuery.where('author.id = :id', { id }).getOne();
      }

      Object.keys(updatedValues).forEach((key, index) => {
        updatedValues[key as keyof typeof updatedValues] = () =>
          `$${index + 1}`;
      });

      const parameters = Object.keys(updatedValues).map(
        (key) => updateAuthorDto[key as keyof typeof updateAuthorDto],
      );

      const updateQuery = this.createQueryBuilder()
        .update()
        .set(updatedValues)
        .where(`id = $${Object.keys(updatedValues).length + 1}`)
        .returning('*')
        .getQuery();

      const rawUpdatedAuthors = (await this.query(
        `WITH "updated_authors" AS (${updateQuery}) ${selectQuery.getQuery().replaceAll(`"public"."authors"`, `"updated_authors"`)}`,
        [...parameters, id],
      )) as any[];
      await this.query(`COMMIT`);

      if (rawUpdatedAuthors.length === 0) return null;

      return rawToEntity(Author, rawUpdatedAuthors[0], 'author');
    } catch (err) {
      await this.query(`ROLLBACK`);
      return null;
    }
  }
}
