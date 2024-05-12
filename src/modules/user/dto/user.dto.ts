import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { User } from '@/modules/user/entities/user.entity';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  address: string;

  @Expose()
  createdTimestamp: Date;

  public static fromUser(user: User): UserDto {
    const userDto = plainToInstance(UserDto, user);
    return userDto;
  }
}
