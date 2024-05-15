import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt-access.guard';
import { JwtAccessStrategy } from '@/modules/auth/strategies/jwt-access.strategy';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { UserModule } from '@/modules/user/user.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtAccessGuard],
})
export class AuthModule {}
