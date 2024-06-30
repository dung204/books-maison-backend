import { Inject, Injectable } from '@nestjs/common';

import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Fine } from '@/modules/fine/entities/fine.entity';
import { FineRepository } from '@/modules/fine/repositories/fine.repository';

import { CreateFineDto } from '../dto/create-fine.dto';
import { UpdateFineDto } from '../dto/update-fine.dto';

@Injectable()
export class FineService {
  constructor(
    @Inject(FineRepository) private readonly fineRepository: FineRepository,
  ) {}

  create(createFineDto: CreateFineDto) {
    createFineDto;
    return 'This action adds a new fine';
  }

  async findAll(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<SuccessResponse<Fine[]>> {
    const { page, pageSize } = paginationQueryDto;
    const [fines, total] =
      await this.fineRepository.findAllAndCount(paginationQueryDto);
    const totalPage = Math.ceil(total / pageSize);

    return {
      data: fines,
      pagination: {
        total,
        page,
        pageSize,
        totalPage,
        hasNextPage: page < totalPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} fine`;
  }

  update(id: number, updateFineDto: UpdateFineDto) {
    updateFineDto;
    return `This action updates a #${id} fine`;
  }
}
