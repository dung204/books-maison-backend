import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { Author } from '@/modules/author/entities/author.entity';
import { AuthorService } from '@/modules/author/services/author.service';

import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@ApiTags('authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @ApiBearerAuth('JWT')
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
  @ApiUnauthorizedResponse({
    description: 'User login is required',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Post('/')
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get('/')
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.authorService.findAll(paginationQueryDto);
  }

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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<Author>> {
    return {
      data: await this.authorService.findAuthorById(id),
    };
  }

  @ApiBearerAuth('JWT')
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
  @ApiUnauthorizedResponse({
    description: 'User login is required',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
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
