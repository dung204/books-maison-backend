import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { PasswordUtils } from '@/base/utils/password.utils';
import { ChangePasswordDto } from '@/modules/user/dto/change-password.dto';
import { UserSearchDto } from '@/modules/user/dto/user-search.dto';
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

  async create(
    createUserDto: CreateUserDto,
  ): Promise<SuccessResponse<UserDto>> {
    const createdUser = await this.userRepository.createUser(createUserDto);

    return {
      data: UserDto.fromUser(createdUser),
    };
  }

  async findAll(
    userSearchDto: UserSearchDto,
  ): Promise<SuccessResponse<UserDto[]>> {
    const { page, pageSize } = userSearchDto;
    const [users, total] =
      await this.userRepository.findAllAndCount(userSearchDto);
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

  async findUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse<UserDto>> {
    if (!this.userRepository.isExistedById(id))
      throw new NotFoundException('User not found.');

    const existedUserByEmail = await this.userRepository.findByEmail(
      updateUserDto.email,
    );
    if (existedUserByEmail?.id !== id)
      throw new ConflictException('Email already taken');

    const updateStatus = await this.userRepository.updateUserById(
      id,
      updateUserDto,
    );
    if (updateStatus != 1)
      throw new ConflictException('Conflicted! Cannot update user.');

    return {
      data: UserDto.fromUser(await this.userRepository.findById(id)),
    };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const passwordMatched = await PasswordUtils.isPasswordMatched(
      changePasswordDto.password,
      user.password,
    );

    if (!passwordMatched)
      throw new UnauthorizedException(
        'Old password does not match with the current password.',
      );

    const updateStatus = await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: await PasswordUtils.hashPassword(
          changePasswordDto.newPassword,
        ),
      },
    );

    if (updateStatus.affected != 1)
      throw new ConflictException(
        'Conflicted! Cannot change password of current user.',
      );
  }
}
