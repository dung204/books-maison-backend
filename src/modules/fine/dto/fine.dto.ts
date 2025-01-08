import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';
import { differenceInCalendarDays } from 'date-fns';

import { CheckoutDto } from '@/modules/checkout/dto/checkout.dto';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';

const FINE_AMOUNT_PER_DAY = 10_000;

@Exclude()
export class FineDto {
  @ApiProperty({
    description: 'The ID of the fine (format: `BM_FI_${Date.now()}`)',
    example: 'BM_FI_1722579577171',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The corresponding checkout of the fine',
    type: CheckoutDto,
  })
  @Expose()
  @Transform(({ value }) => CheckoutDto.fromCheckout(value))
  checkout: CheckoutDto;

  @ApiProperty({
    description: 'The status of the fine',
    enum: FineStatus,
    enumName: 'FineStatus',
    default: FineStatus.ISSUED,
  })
  @Expose()
  status: FineStatus;

  @ApiProperty({
    description: 'The created timestamp of the fine',
    example: '2024-06-30T13:46:54.405Z',
  })
  @Expose()
  createdTimestamp: Date;

  @ApiProperty({
    description: 'The money amount that the user has to pay for this fine',
    example: 50_000,
  })
  @Expose()
  amount: number;

  public static fromFine(fine: Fine) {
    const fineDto = plainToInstance(FineDto, fine);

    const overdueDays = differenceInCalendarDays(
      new Date(),
      fine.checkout.dueTimestamp,
    );
    fineDto.amount = FINE_AMOUNT_PER_DAY * overdueDays;

    return fineDto;
  }
}
