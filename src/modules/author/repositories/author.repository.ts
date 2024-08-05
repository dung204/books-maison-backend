import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AuthorSearchDto } from '@/modules/author/dto/author-search.dto';
import { CreateAuthorDto } from '@/modules/author/dto/create-author.dto';
import { UpdateAuthorDto } from '@/modules/author/dto/update-author.dto';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorOrderableFields } from '@/modules/author/enum/author-orderable-fields.enum';

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
    name,
    nationality,
    yearOfBirthFrom,
    yearOfBirthTo,
    yearOfDeathFrom,
    yearOfDeathTo,
  }: AuthorSearchDto) {
    const skip = (page - 1) * pageSize;
    const actualOrderBy = Object.values(AuthorOrderableFields).includes(orderBy)
      ? orderBy
      : AuthorOrderableFields.CREATED_TIMESTAMP;
    const query = this.createQueryBuilder('author')
      .orderBy(`author.${actualOrderBy}`, order)
      .skip(skip)
      .take(pageSize);

    if (name) {
      query.andWhere('LOWER(author.name) LIKE LOWER(:title)', {
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
    const updateResult = await this.update({ id }, updateAuthorDto);

    return updateResult.affected;
  }
}
