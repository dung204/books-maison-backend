import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { LoginRequest } from '@/modules/auth/requests/login.request';
import { AuthService } from '@/modules/auth/services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginRequest: LoginRequest) {
    return this.authService.login(loginRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/test')
  async test() {
    return 'Hello world';
  }
}
