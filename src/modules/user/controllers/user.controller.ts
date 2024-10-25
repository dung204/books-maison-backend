import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Admin } from '@/base/common/decorators/admin.decorator';
import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { UserSearchDto } from '@/modules/user/dto/user-search.dto';
import { UserDto } from '@/modules/user/dto/user.dto';

import { UserService } from '../services/user.service';

@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Admin()
  @ApiOperation({ summary: 'Get all users (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: true,
    pagination: true,
    description:
      'Get all users information successfully (with pagination metadata).',
  })
  @Get('/')
  findAll(@Query() userSearchDto: UserSearchDto) {
    return this.userService.findAll(userSearchDto);
  }

  @Admin()
  @ApiOperation({ summary: 'Get a user by id (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
    description: 'User is retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<UserDto>> {
    const user = await this.userService.findUserById(id);

    return {
      data: UserDto.fromUser(user),
    };
  }
}
