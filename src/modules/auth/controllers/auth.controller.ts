import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators';
import { CustomRequest } from '@/base/common/types';
import { Private, Public } from '@/modules/auth/decorators';
import { OAuthAction } from '@/modules/auth/enums';
import { JwtExceptionFilter } from '@/modules/auth/filters';
import { LocalAuthGuard } from '@/modules/auth/guards';
import {
  GoogleRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
} from '@/modules/auth/requests';
import {
  LoginSuccessPayload,
  RefreshSuccessPayload,
} from '@/modules/auth/responses';
import { AuthService } from '@/modules/auth/services';
import { UserDto } from '@/modules/user/dtos';

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
    return this.authService.login(req.user!);
  }

  @Public()
  @ApiOperation({ summary: 'Create new (refresh) tokens' })
  @ApiBody({
    type: RefreshRequest,
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: 'New tokens returned',
    schema: RefreshSuccessPayload,
    isArray: false,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is blacklisted',
  })
  @ApiBadRequestResponse({
    description: 'JWT error (malformed, expired, ...)',
  })
  @UseFilters(JwtExceptionFilter)
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
    const accessToken = req.headers.authorization!.replaceAll('Bearer ', '');
    await this.authService.logout(req.user!, accessToken);
  }

  @Public()
  @ApiOperation({
    summary: 'Handle Google authentication',
  })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: 'Successful authentication',
    schema: LoginSuccessPayload,
    isArray: false,
  })
  @ApiConflictResponse({
    description: `Due to one of the two reasons:\n- For \`${OAuthAction.AUTHENTICATE}\` action, a user that is not linked to Google has been found.\n- For \`${OAuthAction.LINK}\` & \`${OAuthAction.OVERRIDE}\` action, a user that is already linked to Google has been found.`,
  })
  @Post('/google')
  async handleGoogleAuth(@Body() googleRequest: GoogleRequest) {
    return this.authService.handleGoogleAuth(googleRequest);
  }
}
