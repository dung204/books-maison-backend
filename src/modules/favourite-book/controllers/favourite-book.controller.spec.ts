import { Test, TestingModule } from '@nestjs/testing';

import { FavouriteBookController } from './favourite-book.controller';

describe('FavouriteBookController', () => {
  let controller: FavouriteBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavouriteBookController],
    }).compile();

    controller = module.get<FavouriteBookController>(FavouriteBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
