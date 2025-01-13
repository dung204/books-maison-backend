import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@/modules/user/controllers';
import { User } from '@/modules/user/entities';
import { UserRepository } from '@/modules/user/repositories';
import { UserService } from '@/modules/user/services';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
