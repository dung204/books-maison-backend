import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { OAuthAction } from '@/modules/auth/enums';

export class GoogleRequest {
  @ApiProperty({
    description: 'The authorization code retrieved from Google login',
    example:
      '4/0AanRRrsW0MyRmIrp4e-89quX3bMMZRK8_QW4efAGdcIwjr2bHwPs8ozJokN9fSqO5Mg9BQ',
  })
  @IsString()
  code!: string;

  @ApiProperty({
    description:
      'The action to perform when a Google user info is retrieved successfully.',
    enum: OAuthAction,
    enumName: 'OAuthAction',
  })
  @IsEnum(OAuthAction, {
    message: `The OAuth action must be one of these values: ${Object.values(OAuthAction).join(', ')}`,
  })
  action!: OAuthAction;
}
