import { ApiProperty } from '@nestjs/swagger';

import { Role } from '@/base/common/enum/role.enum';

export class LoginSuccessResponse {
  @ApiProperty({
    description: 'The UUID of the user',
    example: '1e0f70d1-c901-5b64-8a61-496cb071f56e',
  })
  id: string;

  @ApiProperty({
    enum: Role,
    description: 'The role of the user',
    example: Role.USER,
  })
  role: Role;

  @ApiProperty({
    description: 'The JWT access token of the user',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTBmNzBkMS1jOTAxLTViNjQtOGE2MS00OTZjYjA3MWY1NmUiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.5aUfuG_eCqwjV3NpQihFsNGlOx3U-oppgJmnhroP4MU',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'The JWT token to create new (refresh) the access token if it expires',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTBmNzBkMS1jOTAxLTViNjQtOGE2MS00OTZjYjA3MWY1NmUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjg0MzgyMn0.Ab4SK1DF3-1-qf1JXN_IoTXzv22ltqGKabr_NlSvXeY',
  })
  refreshToken: string;
}
