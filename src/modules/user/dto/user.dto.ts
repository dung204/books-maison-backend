import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { User } from '@/modules/user/entities/user.entity';

@Exclude()
export class UserDto {
  @ApiProperty({
    description: 'The UUID of the user',
    example: '7d7ccb57-da6e-42c8-b427-1487abd89a0a',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'email@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'The address of the user',
    example: 'Hanoi, Vietnam',
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: 'The timestamp indicating when the user is created',
    example: '2024-05-12T07:47:36.958Z',
  })
  @Expose()
  createdTimestamp: Date;

  public static fromUser(user: User): UserDto {
    const userDto = plainToInstance(UserDto, user);
    return userDto;
  }
}
