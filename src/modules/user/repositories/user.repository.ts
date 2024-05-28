import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
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
}
