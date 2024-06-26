import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { UserCreateCheckoutDto } from '@/modules/checkout/dto/user-create-checkout.dto';

export class AdminCreateCheckoutDto extends UserCreateCheckoutDto {
  @ApiProperty({
    description: 'The UUID of the user to be included in the checkout',
    example: '809f6dc4-9bc7-54fd-97f1-1d70685e9cc6',
  })
  @IsNotEmpty()
  @IsUUID(4, { message: 'Book ID must be a valid UUID v4' })
  userId: string;
}
