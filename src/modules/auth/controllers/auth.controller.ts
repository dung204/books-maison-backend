import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { CustomRequest } from '@/base/common/types/custom-request.type';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { AuthService } from '@/modules/auth/services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: CustomRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAccessGuard)
  @Post('/refresh')
  async refresh(
    @Request() req: CustomRequest,
    @Body('refreshToken') refreshToken: string,
  ) {
    const accessToken = req.headers.authorization.replaceAll('Bearer ', '');
    return this.authService.refresh(req.user, accessToken, refreshToken);
  }
}
