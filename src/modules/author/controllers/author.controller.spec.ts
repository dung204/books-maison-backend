import { Test, TestingModule } from '@nestjs/testing';

import { AuthorController } from '@/modules/author/controllers/author.controller';
import { AuthorService } from '@/modules/author/services/author.service';

describe('AuthorController', () => {
  let controller: AuthorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [AuthorService],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
