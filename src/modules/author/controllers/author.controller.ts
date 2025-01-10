import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { SuccessResponse } from '@/base/common/responses';
import { Admin, Public } from '@/modules/auth/decorators';
import {
  AuthorDto,
  AuthorSearchDto,
  CreateAuthorDto,
  UpdateAuthorDto,
} from '@/modules/author/dtos';
import { AuthorService } from '@/modules/author/services';

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
    schema: AuthorDto,
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
    schema: AuthorDto,
    isArray: true,
    pagination: true,
    description:
      'Get all authors information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() authorSearchDto: AuthorSearchDto) {
    return this.authorService.findAll(authorSearchDto);
  }

  @Admin()
  @ApiOperation({
    summary: 'Get all deleted authors (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: AuthorDto,
    isArray: true,
    pagination: true,
    description:
      'Get all deleted authors information successfully (with pagination metadata).',
  })
  @Get('/deleted')
  findAllDeletedOnly(@Query() authorSearchDto: AuthorSearchDto) {
    return this.authorService.findAllDeletedOnly(authorSearchDto);
  }

  @Public()
  @ApiOperation({
    summary: 'Get an author by ID',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: AuthorDto,
    isArray: false,
    description: 'Author is retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Author is not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<AuthorDto>> {
    return {
      data: AuthorDto.fromAuthor(await this.authorService.findAuthorById(id)),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Update an author by ID (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: AuthorDto,
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
  ): Promise<SuccessResponse<AuthorDto>> {
    return {
      data: await this.authorService.update(id, updateAuthorDto),
    };
  }

  @Admin()
  @ApiOperation({
    summary: 'Mark an author as deleted (for ADMIN only)',
  })
  @ApiNoContentResponse({
    description: 'The author is marked as deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'The author is not found or has already marked as deleted',
  })
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAuthor(@Param('id') id: string) {
    return this.authorService.softDeleteAuthor(id);
  }

  @Admin()
  @ApiOperation({
    summary: 'Recover an author from the deleted (for ADMIN only)',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: AuthorDto,
    isArray: false,
    description: 'The author is marked as deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'The author is not found or has already marked as deleted',
  })
  @Patch('/recover/:id')
  async recoverAuthor(@Param('id') id: string) {
    return this.authorService.recoverAuthor(id);
  }
}
