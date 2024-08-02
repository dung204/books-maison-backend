import { ApiProperty } from '@nestjs/swagger';
import { differenceInCalendarDays } from 'date-fns';

import { Checkout } from '@/modules/checkout/entities/checkout.entity';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineStatus } from '@/modules/fine/enums/fine-status.enum';

const FINE_AMOUNT_PER_DAY = 10_000;

export class FineDto {
  @ApiProperty({
    description: 'The ID of the fine (format: `BM_FI_${Date.now()}`)',
    example: 'BM_FI_1722579577171',
  })
  id: string;

  @ApiProperty({
    description: 'The corresponding checkout of the fine',
    type: Checkout,
  })
  checkout: Checkout;

  @ApiProperty({
    description: 'The status of the fine',
    enum: FineStatus,
    enumName: 'FineStatus',
    default: FineStatus.ISSUED,
  })
  status: FineStatus;

  @ApiProperty({
    description: 'The created timestamp of the fine',
    example: '2024-06-30T13:46:54.405Z',
  })
  createdTimestamp: Date;

  @ApiProperty({
    description: 'The money amount that the user has to pay for this fine',
    example: 50_000,
  })
  amount: number;

  public static fromFine(fine: Fine) {
    const fineDto = new FineDto();
    Object.assign(fineDto, fine);

    const overdueDays = differenceInCalendarDays(
      new Date(),
      fine.checkout.dueTimestamp,
    );
    fineDto.amount = FINE_AMOUNT_PER_DAY * overdueDays;

    return fineDto;
  }
}
