import { ApiProperty } from '@nestjs/swagger';

import { TransactionMethod } from '@/modules/transaction/enums/transaction-method.enum';
import { UserDto } from '@/modules/user/dto/user.dto';

export class TransactionDto {
  @ApiProperty({
    description: 'The ID of the transaction',
    example: 'af119453-910b-5d5a-9c21-706cb677539d',
  })
  id: string;

  @ApiProperty({
    description: 'The user who performs the transaction',
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'The money amount of the transaction',
    example: 100_000,
  })
  amount: number;

  @ApiProperty({
    description: 'The method that the transaction is performed',
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  method: TransactionMethod;

  @ApiProperty({
    description: 'The created timestamp of the transaction',
    example: '2024-07-04T06:10:02.679Z',
  })
  createdTimestamp: Date;

  @ApiProperty({
    description: 'The URL which user can enter and perform the purchase',
    example: 'http://ose.lt/jaj',
    required: false,
  })
  purchaseUrl?: string;
}
