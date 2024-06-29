import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class MarkReturnedCheckoutDto {
  @ApiProperty({
    description: 'Additional note for the checkout',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Note must be a string' })
  note?: string;
}
