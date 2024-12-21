import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Avatar } from '@/modules/me/entities/avatar.entity';

@Injectable()
export class AvatarRepository extends Repository<Avatar> {
  constructor(private dataSource: DataSource) {
    super(Avatar, dataSource.createEntityManager());
  }

  async findByUserId(userId: string) {
    return this.createQueryBuilder('avatar')
      .leftJoin('avatar.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();
  }
}
