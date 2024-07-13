import { Test, TestingModule } from '@nestjs/testing';

import { CheckoutService } from '@/modules/checkout/services/checkout.service';

import { CheckoutController } from './checkout.controller';

describe('CheckoutController', () => {
  let controller: CheckoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [CheckoutService],
    }).compile();

    controller = module.get<CheckoutController>(CheckoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
