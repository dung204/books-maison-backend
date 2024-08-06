import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { UserOrderableField } from '@/modules/user/enums/user-orderable-field.enum';

export class UserSearchDto extends OmitType(PaginationQueryDto, ['orderBy']) {
  @ApiProperty({
    description: 'The field to order the results by',
    enum: UserOrderableField,
    enumName: 'UserOrderableField',
    default: UserOrderableField.CREATED_TIMESTAMP,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Order by must be a string' })
  orderBy?: UserOrderableField = UserOrderableField.CREATED_TIMESTAMP;

  @ApiProperty({
    description:
      'Every users with first name containing this first name will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @ApiProperty({
    description:
      'Every users with last name containing this last name will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @ApiProperty({
    description:
      'Every users with address containing this address will be returned',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;
}
