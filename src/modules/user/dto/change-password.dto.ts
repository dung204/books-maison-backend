import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'fVs))^vue{lbwIH',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: 'The new password of the user',
    example: 'fVs))^vue{lbwIH',
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must contain at least 6 characters' })
  @MaxLength(100, { message: 'New password must not exceed 100 characters' })
  newPassword: string;
}
