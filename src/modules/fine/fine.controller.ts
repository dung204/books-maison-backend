import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateFineDto } from './dto/create-fine.dto';
import { UpdateFineDto } from './dto/update-fine.dto';
import { FineService } from './fine.service';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  create(@Body() createFineDto: CreateFineDto) {
    return this.fineService.create(createFineDto);
  }

  @Get()
  findAll() {
    return this.fineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFineDto: UpdateFineDto) {
    return this.fineService.update(+id, updateFineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fineService.remove(+id);
  }
}
