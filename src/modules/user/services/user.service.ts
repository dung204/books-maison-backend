import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { SuccessResponse } from '@/base/common/responses';
import { PasswordUtils } from '@/base/utils';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  UserSearchDto,
} from '@/modules/user/dtos';
import { User } from '@/modules/user/entities';
import { UserRepository } from '@/modules/user/repositories';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserRepository.name);

  constructor(private readonly userRepository: UserRepository) {}

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

  async findAllDeletedOnly(userSearchDto: UserSearchDto) {
    return this.findAll({ ...userSearchDto, deletedOnly: true });
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse<UserDto>> {
    if (!this.userRepository.isExistedById(id))
      throw new NotFoundException('User not found.');

    if (updateUserDto.email) {
      const existedUserByEmail = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existedUserByEmail?.id !== id)
        throw new ConflictException('Email already taken');
    }

    const updateStatus = await this.userRepository.updateUserById(
      id,
      updateUserDto,
    );
    if (updateStatus != 1)
      throw new ConflictException('Conflicted! Cannot update user.');

    return {
      data: UserDto.fromUser((await this.userRepository.findById(id)) as User),
    };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const passwordMatched = await PasswordUtils.isPasswordMatched(
      changePasswordDto.password,
      user.password!,
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

  async deactivateUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        checkouts: {
          fine: true,
        },
        transactions: true,
      },
    });

    if (!user)
      throw new NotFoundException(
        'User not found or user is already deactivated.',
      );

    return this.deactivateUser(user);
  }

  async deactivateUser(user: User) {
    await this.userRepository.softRemove(user);
  }

  async reactivateUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        checkouts: {
          fine: true,
        },
        transactions: true,
      },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(
        'User not found or user is not currently deactivated.',
      );
    }

    return this.reactivateUser(user);
  }

  async reactivateUser(user: User): Promise<SuccessResponse<UserDto>> {
    return {
      data: UserDto.fromUser(await this.userRepository.recover(user)),
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteCategories() {
    const deleteResult = await this.userRepository
      .createQueryBuilder()
      .delete()
      .where('(CURRENT_TIMESTAMP::date - deletedTimestamp ::date) >= 30')
      .execute();

    this.logger.log(
      `${deleteResult.affected} categories have been deleted successfully.`,
    );
  }
}
