import { Optional } from '@nestjs/common';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is not a valid email' })
  email: string;

  @IsStrongPassword({}, { message: 'Password is not a strong password' })
  password: string;

  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsString({ message: 'Address must be a string' })
  @Optional()
  address?: string;
}
