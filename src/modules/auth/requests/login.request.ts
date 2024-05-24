import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
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
  @IsString()
  password: string;
}
