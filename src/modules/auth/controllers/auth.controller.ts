import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { AuthService } from '@/modules/auth/services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAccessGuard)
  @Post('/refresh')
  async refresh(@Request() req, @Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(req.user, refreshToken);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/test')
  async test(@Request() req) {
    return req.user;
  }
}
