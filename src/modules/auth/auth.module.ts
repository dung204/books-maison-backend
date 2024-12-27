import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { JwtAccessStrategy } from '@/modules/auth/strategies/jwt-access.strategy';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';
import { MeModule } from '@/modules/me/me.module';
import { MediaModule } from '@/modules/media/media.module';
import { UserModule } from '@/modules/user/user.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    HttpModule,
    MediaModule,
    MeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy],
  exports: [AuthService],
})
export class AuthModule {}
