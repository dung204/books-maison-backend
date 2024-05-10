import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Fine } from '@/modules/fine/entities/fine.entity';

import { FineController } from './fine.controller';
import { FineService } from './fine.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fine])],
  controllers: [FineController],
  providers: [FineService],
  exports: [FineService],
})
export class FineModule {}
