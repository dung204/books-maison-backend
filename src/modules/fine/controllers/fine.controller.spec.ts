import { Test, TestingModule } from '@nestjs/testing';

import { FineService } from '@/modules/fine/services/fine.service';

import { FineController } from './fine.controller';

describe('FineController', () => {
  let controller: FineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FineController],
      providers: [FineService],
    }).compile();

    controller = module.get<FineController>(FineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
