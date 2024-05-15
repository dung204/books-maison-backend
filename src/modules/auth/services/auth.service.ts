import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginRequest } from '@/modules/auth/requests/login.request';
import { JwtPayload } from '@/modules/auth/types/jwt-payload.type';
import { UserService } from '@/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user?.password === password) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login({ email, password }: LoginRequest) {
    const user = await this.validateUser(email, password);

    if (!user) throw new BadRequestException('Email or password is incorrect');

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
