import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { AdminGuard } from '@/modules/auth/guards/admin.guard';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { ChangePasswordDto } from '@/modules/user/dto/change-password.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { UpdateProfileRequest } from '@/modules/user/requests/update-profile.request';

import { UserService } from '../services/user.service';

@ApiBearerAuth('JWT')
@ApiTags('users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get profile of current user' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Get('/me')
  async getCurrentUserProfile(
    @Request() req: CustomRequest,
  ): Promise<SuccessResponse<UserDto>> {
    return {
      data: UserDto.fromUser(req.user),
    };
  }

  @ApiOperation({ summary: 'Update profile of current user' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
    description: 'Profile is updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in',
  })
  @ApiBadRequestResponse({
    description: 'Update information is invalid',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Patch('/me')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUserProfile(
    @Request() req: CustomRequest,
    @Body() updateProfileRequest: UpdateProfileRequest,
  ) {
    const currentUser = req.user;
    return this.userService.update(currentUser.id, updateProfileRequest);
  }

  @ApiOperation({ summary: 'Change the password of current user' })
  @ApiNoContentResponse({ description: 'Password is changed successfully' })
  @ApiUnauthorizedResponse({
    description: `- The user is not logged in\n\n- The old password mismatches with the current password`,
  })
  @ApiConflictResponse({
    description: 'Conflicted',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Patch('/me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePasswordOfCurrentUser(
    @Request() req: CustomRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const currentUser = req.user;
    return this.userService.changePassword(currentUser, changePasswordDto);
  }

  @ApiOperation({ summary: 'Get all users (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: true,
    pagination: true,
    description:
      'Get all users information successfully (with pagination metadata).',
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
  @Get('/')
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAll(paginationQueryDto);
  }

  @ApiOperation({ summary: 'Get a user by id (for ADMIN only)' })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    schema: UserDto,
    isArray: false,
    description: 'User is retrieved successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'User login is required',
  })
  @ApiForbiddenResponse({
    description: 'The current authenticated user is not an ADMIN.',
  })
  @ApiNotFoundResponse({
    description: 'User is not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard, AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse<UserDto>> {
    const user = await this.userService.findUserById(id);

    return {
      data: UserDto.fromUser(user),
    };
  }
}
