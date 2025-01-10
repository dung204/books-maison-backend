import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

import { SQLNullableTransform } from '@/base/common/decorators';
import { SQLNullable } from '@/base/common/types';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@example.com',
  })
  @IsEmail({}, { message: 'Email is not a valid email' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description:
      'The address of the user (use `NULL` string if updating to null)',
    example: 'Hanoi, Vietnam',
  })
  @SQLNullableTransform()
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: SQLNullable<string>;
}
