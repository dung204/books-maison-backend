import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { UserDto } from '@/modules/user/dto/user.dto';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SuccessResponse<User>> {
    const createdUser = await this.userRepository.createUser(createUserDto);

    return {
      data: createdUser,
    };
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<UserDto[]>> {
    const { page, pageSize } = paginationQueryDto;
    const skip = (page - 1) * pageSize;
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: pageSize,
    });
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: users.map(UserDto.fromUser),
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

  async findUserById(id: string): Promise<SuccessResponse<UserDto>> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found.');

    return {
      data: UserDto.fromUser(user),
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!this.userRepository.isExistedById(id))
      throw new NotFoundException('User not found.');

    const updateStatus = await this.userRepository.updateUserById(
      id,
      updateUserDto,
    );
    if (updateStatus != 1)
      throw new ConflictException('Conflicted! Cannot update user.');

    return UserDto.fromUser(await this.userRepository.findById(id));
  }
}
