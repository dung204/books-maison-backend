import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

import { Avatar } from '@/modules/me/entities/avatar.entity';

@Exclude()
export class AvatarDto {
  @ApiProperty({
    description: 'The display name of the avatar in Cloudinary',
    example: 'metpk6lemi4eccrgzosm',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description:
      'The offset X position from the center of the original avatar which is scaled to a height of `zoom` x 300px',
    example: 200,
  })
  @Expose()
  offsetX: number;

  @ApiProperty({
    description:
      'The offset Y position from the center of the original avatar which is scaled to a height of `zoom` x 300px',
    example: 200,
  })
  @Expose()
  offsetY: number;

  @ApiProperty({
    description:
      'The zoom ratio of the avatar compared to the original avatar which is scaled to a height of 300px',
    example: 1,
  })
  @Expose()
  zoom: number;

  public static fromAvatar(avatar: Avatar) {
    return plainToInstance(AvatarDto, avatar);
  }
}
