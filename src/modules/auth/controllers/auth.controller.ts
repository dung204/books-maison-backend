import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiSuccessResponse } from '@/base/common/decorators/api-success-response.decorator';
import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { LoginRequest } from '@/modules/auth/requests/login.request';
import { RefreshRequest } from '@/modules/auth/requests/refresh.request';
import { LoginSuccessPayload } from '@/modules/auth/responses/login-success.response';
import { RefreshSuccessPayload } from '@/modules/auth/responses/refresh-success.response';
import { AuthService } from '@/modules/auth/services/auth.service';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: CustomRequest) {
    return this.authService.login(req.user);
  }

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
    description:
      'Refresh token does not belong to the current user or the user did not log in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error.',
  })
  @UseGuards(JwtAccessGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req: CustomRequest,
    @Body() { refreshToken }: RefreshRequest,
  ) {
    const accessToken = req.headers.authorization.replaceAll('Bearer ', '');
    return this.authService.refresh(req.user, accessToken, refreshToken);
  }

  @ApiOperation({
    summary: 'Logout to the system',
  })
  @ApiNoContentResponse({
    description: 'Successful logout',
  })
  @ApiUnauthorizedResponse({
    description: 'The user did not log in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @UseGuards(JwtAccessGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: CustomRequest) {
    const accessToken = req.headers.authorization.replaceAll('Bearer ', '');
    await this.authService.logout(req.user, accessToken);
  }
}
