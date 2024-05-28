import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiOkPaginatedResponse } from '@/base/common/decorators/api-ok-paginated-response.decorator';
import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { PaginationQueryDto } from '@/base/common/dto/pagination-query.dto';
import { SuccessResponse } from '@/base/common/responses/success.response';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
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
  @Get('/profile')
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
  @Post('/profile')
  @HttpCode(HttpStatus.OK)
  async updateCurrentUserProfile(
    @Request() req: CustomRequest,
    @Body() updateProfileRequest: UpdateProfileRequest,
  ) {
    const currentUser = req.user;
    return this.userService.update(currentUser.id, updateProfileRequest);
  }

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
}
