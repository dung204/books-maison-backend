import { OmitType } from '@nestjs/swagger';

import { CheckoutSearchDto } from '@/modules/checkout/dtos/checkout-search.dto';

export class UserCheckoutSearchDto extends OmitType(CheckoutSearchDto, [
  'userId',
]) {}
