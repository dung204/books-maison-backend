import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@example.com',
  })
  @IsEmail({}, { message: 'Email is not a valid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the user (requires strong password)',
    example: 'fVs))^vue{lbwIH',
  })
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Hanoi, Vietnam',
  })
  @IsString({ message: 'Address must be a string' })
  @Optional()
  address?: string;
}
