import { ConflictException, Injectable } from '@nestjs/common';

import { SuccessResponse } from '@/base/common/responses/success.response';
import { AvatarDto } from '@/modules/me/dtos/avatar.dto';
import { SetAvatarDto } from '@/modules/me/dtos/set-avatar.dto';
import { Avatar } from '@/modules/me/entities/avatar.entity';
import { AvatarRepository } from '@/modules/me/repositories/avatar.repository';
import { MediaService } from '@/modules/media/services/media.service';
import { User } from '@/modules/user/entities/user.entity';
import { UserRepository } from '@/modules/user/repositories/user.repository';

@Injectable()
export class AvatarService {
  private readonly AVATAR_FOLDER = 'avatars';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly avatarRepository: AvatarRepository,
    private readonly mediaService: MediaService,
  ) {}

  async setAvatar(
    user: User,
    setAvatarDto: SetAvatarDto,
  ): Promise<SuccessResponse<AvatarDto>> {
    const avatarIdExisted = await this.avatarRepository.exists({
      where: { id: setAvatarDto.id },
    });

    if (avatarIdExisted) throw new ConflictException('Avatar ID has existed.');

    await this.mediaService.checkFileExists({
      name: setAvatarDto.id,
      folder: this.AVATAR_FOLDER,
    });

    const oldAvatar = await this.avatarRepository.findOneBy({ user });
    if (oldAvatar) {
      await this.mediaService.deleteFile({
        name: oldAvatar.id,
        folder: this.AVATAR_FOLDER,
      });
      await this.avatarRepository.delete(oldAvatar);
    }

    const newAvatar = new Avatar();
    Object.assign(newAvatar, setAvatarDto);
    newAvatar.user = user;

    user.avatar = newAvatar;
    await this.userRepository.save(user);

    return {
      data: AvatarDto.fromAvatar(newAvatar),
    };
  }
}
