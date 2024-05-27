import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterRequest {
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
  @IsStrongPassword({}, { message: 'Password is not a strong password' })
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
  @IsOptional()
  address?: string;
}
