import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

import { Transaction } from '@/modules/transaction/entities';
import { TransactionMethod } from '@/modules/transaction/enums';
import { UserDto } from '@/modules/user/dtos';

@Exclude()
export class TransactionDto {
  @ApiProperty({
    description: 'The ID of the transaction',
    example: 'af119453-910b-5d5a-9c21-706cb677539d',
  })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'The user who performs the transaction',
    type: UserDto,
  })
  @Expose()
  @Transform(({ value }) => UserDto.fromUser(value))
  user!: UserDto;

  @ApiProperty({
    description: 'The money amount of the transaction',
    example: 100_000,
  })
  @Expose()
  amount!: number;

  @ApiProperty({
    description: 'The method that the transaction is performed',
    enum: TransactionMethod,
    enumName: 'TransactionMethod',
  })
  @Expose()
  method!: TransactionMethod;

  @ApiProperty({
    description: 'The created timestamp of the transaction',
    example: '2024-07-04T06:10:02.679Z',
  })
  @Expose()
  createdTimestamp!: Date;

  @ApiProperty({
    description: 'The URL which user can enter and perform the purchase',
    example: 'http://ose.lt/jaj',
    required: false,
  })
  @Expose()
  purchaseUrl?: string;

  public static fromTransaction(transaction: Transaction) {
    return plainToInstance(TransactionDto, transaction);
  }
}
