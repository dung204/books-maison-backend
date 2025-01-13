import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { SuccessResponse } from '@/base/common/responses';
import { Admin } from '@/modules/auth/decorators';
import { UserDto, UserSearchDto } from '@/modules/user/dtos';
import { UserService } from '@/modules/user/services';

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
  @ApiOperation({ summary: 'Get all deleted users (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: true,
    pagination: true,
    description:
      'Get all deleted users information successfully (with pagination metadata).',
  })
  @Get('/deleted')
  findAllDeletedOnly(@Query() userSearchDto: UserSearchDto) {
    return this.userService.findAllDeletedOnly(userSearchDto);
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

  @Admin()
  @ApiOperation({ summary: 'Deactivate a user by user id (for ADMIN only)' })
  @ApiNoContentResponse({
    description: 'User is deactivated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found or is already deactivated.',
  })
  @Delete('/deactivate/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateUser(@Param('id') userId: string) {
    return this.userService.deactivateUserById(userId);
  }

  @Admin()
  @ApiOperation({ summary: 'Reactivate a user by user id (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
    description: 'User is reactivated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found or is not currently deactivated.',
  })
  @Patch('/reactivate/:id')
  async reactivateUser(@Param('id') userId: string) {
    return this.userService.reactivateUserById(userId);
  }
}
