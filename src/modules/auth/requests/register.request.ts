import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    description: 'The email of the user',
    example: 'email@example.com',
  })
  @IsEmail({}, { message: 'Email is not a valid email' })
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'fVs))^vue{lbwIH',
  })
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(128)
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty({ message: 'Last name must not be empty' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(128)
  lastName: string;

  @ApiPropertyOptional({
    description: 'The last name of the user',
    example: 'Hanoi, Vietnam',
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  @MaxLength(256)
  address?: string;
}
