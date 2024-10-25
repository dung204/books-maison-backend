import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { Admin } from '@/modules/auth/decorators/admin.decorator';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { AuthorSearchDto } from '@/modules/author/dto/author-search.dto';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorService } from '@/modules/author/services/author.service';

import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Admin()
  @ApiOperation({
    summary: 'Create a new author (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    schema: Author,
    isArray: false,
    description: 'Successful author creation',
  })
  @ApiBadRequestResponse({
    description: 'Author information is invalid',
  })
  @Post('/')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get all authors',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Author,
    isArray: true,
    pagination: true,
    description:
      'Get all authors information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() authorSearchDto: AuthorSearchDto) {
    return this.authorService.findAll(authorSearchDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get an author by ID',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Author,
    isArray: false,
    description: 'Author is retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Author is not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<Author>> {
    return {
      data: await this.authorService.findAuthorById(id),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Update an author by ID (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: Author,
    isArray: false,
    description: 'Successful author update',
  })
  @ApiBadRequestResponse({
    description: 'Author information is invalid',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<SuccessResponse<Author>> {
    return {
      data: await this.authorService.update(id, updateAuthorDto),
    };
  }
}
