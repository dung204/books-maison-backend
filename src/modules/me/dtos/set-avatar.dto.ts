import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SetAvatarDto {
  @ApiProperty({
    description: 'The display name of the avatar in Cloudinary',
    example: 'metpk6lemi4eccrgzosm',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description:
      'The offset X position from the center of the original avatar which is scaled to a width of `zoom` x 300px',
    example: 200,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false, allowInfinity: false })
  offsetX: number;

  @ApiProperty({
    description:
      'The offset Y position from the center of the original avatar which is scaled to a width of `zoom` x 300px',
    example: 200,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false, allowInfinity: false })
  offsetY: number;

  @ApiProperty({
    description:
      'The zoom ratio of the avatar compared to the original avatar which is scaled to a width of 300px',
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false, allowInfinity: false })
  zoom: number;
}
