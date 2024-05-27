import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkPaginatedResponse } from '@/base/common/decorators/api-ok-paginated-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { UserDto } from '@/modules/user/dto/user.dto';

import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkPaginatedResponse({
    schema: UserDto,
    description:
      'Get all users information successfully (with pagination metadata).',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get('/')
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiOkResponse({
    type: UserDto,
    description: 'User is retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiBody({
    type: UpdateUserDto,
    required: false,
  })
  @ApiOkResponse({
    type: UserDto,
    description: 'User is updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
