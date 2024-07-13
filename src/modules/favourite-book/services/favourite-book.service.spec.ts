import { Test, TestingModule } from '@nestjs/testing';

import { FavouriteBookService } from './favourite-book.service';

describe('FavouriteBookService', () => {
  let service: FavouriteBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavouriteBookService],
    }).compile();

    service = module.get<FavouriteBookService>(FavouriteBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
