import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshRequest {
  @ApiProperty({
    description:
      'The JWT token to create new (refresh) the access token if it expires',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZTBmNzBkMS1jOTAxLTViNjQtOGE2MS00OTZjYjA3MWY1NmUiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTUxNjg0MzgyMn0.Ab4SK1DF3-1-qf1JXN_IoTXzv22ltqGKabr_NlSvXeY',
  })
  @IsString()
  refreshToken: string;
}
