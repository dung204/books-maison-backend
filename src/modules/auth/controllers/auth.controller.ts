import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { Public } from '@/modules/auth/decorators/public.decorator';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { LoginRequest } from '@/modules/auth/requests/login.request';
import { RefreshRequest } from '@/modules/auth/requests/refresh.request';
import { RegisterRequest } from '@/modules/auth/requests/register.request';
import { LoginSuccessPayload } from '@/modules/auth/responses/login-success.response';
import { RefreshSuccessPayload } from '@/modules/auth/responses/refresh-success.response';
import { AuthService } from '@/modules/auth/services/auth.service';
import { UserDto } from '@/modules/user/dto/user.dto';

import { Private } from '../decorators/private.decorator';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({
    type: RegisterRequest,
  })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    description: 'Successful register',
    schema: UserDto,
    isArray: false,
  })
  @ApiConflictResponse({
    description: 'Email already taken',
  })
  @Post('/register')
  async register(@Body() registerRequest: RegisterRequest) {
    return this.authService.register(registerRequest);
  }

  @Public()
  @ApiOperation({ summary: 'Login to the system' })
  @ApiBody({
    type: LoginRequest,
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: 'Successful login',
    schema: LoginSuccessPayload,
    isArray: false,
  })
  @ApiUnauthorizedResponse({
    description: 'The email or password is invalid.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: CustomRequest) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Create new (refresh) tokens' })
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  @ApiBody({
    type: RefreshRequest,
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: 'New tokens returned',
    schema: RefreshSuccessPayload,
    isArray: false,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() { refreshToken }: RefreshRequest) {
    return this.authService.refresh(refreshToken);
  }

  @Private()
  @ApiOperation({
    summary: 'Logout to the system',
  })
  @ApiNoContentResponse({
    description: 'Successful logout',
  })
  @Delete('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: CustomRequest) {
    const accessToken = req.headers.authorization.replaceAll('Bearer ', '');
    await this.authService.logout(req.user, accessToken);
  }
}
