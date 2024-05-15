import { IsEmail, IsString } from 'class-validator';

export class LoginRequest {
  @IsEmail({}, { message: 'Email is not a valid email' })
  email: string;

  @IsString()
  password: string;
}
