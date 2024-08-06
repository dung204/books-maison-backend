import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { UserSearchDto } from '@/modules/user/dto/user-search.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserOrderableField } from '@/modules/user/enums/user-orderable-field.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findAllAndCount({
    page,
    pageSize,
    order,
    orderBy,
    address,
    firstName,
    lastName,
  }: UserSearchDto) {
    const skip = (page - 1) * pageSize;
    const query = this.createQueryBuilder('user')
      .orderBy(this.resolveOrderBy(orderBy), order)
      .skip(skip)
      .take(pageSize);

    if (firstName) {
      query.andWhere('LOWER(user.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      query.andWhere('LOWER(user.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${lastName}%`,
      });
    }

    if (address) {
      query.andWhere('LOWER(user.address) LIKE LOWER(:address)', {
        address: `%${address}%`,
      });
    }

    return query.getManyAndCount();
  }

  findByEmail(email: string) {
    return this.findOneBy({ email });
  }

  findById(id: string) {
    return this.findOneBy({ id });
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = new User();
    Object.assign(user, createUserDto);
    await this.save(user);
    return user;
  }

  isExistedById(id: string) {
    return this.existsBy({ id });
  }

  isExistedByEmail(email: string) {
    return this.existsBy({ email });
  }

  async updateUserById(id: string, updateUserDto: UpdateUserDto) {
    const updateResult = await this.update({ id }, updateUserDto);

    return updateResult.affected;
  }

  private resolveOrderBy(orderBy: UserOrderableField) {
    return Object.values(UserOrderableField).includes(orderBy)
      ? `user.${orderBy}`
      : `user.${UserOrderableField.CREATED_TIMESTAMP}`;
  }
}
