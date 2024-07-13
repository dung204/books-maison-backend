import { registerAs } from '@nestjs/config';

export interface JwtConfigOptions {
  accessSecret: string;
  refreshSecret: string;
  accessExpiration: number;
  refreshExpiration: number;
}

export default registerAs(
  'jwt',
  (): JwtConfigOptions => ({
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: +process.env.JWT_ACCESS_EXPIRATION,
    refreshExpiration: +process.env.JWT_REFRESH_EXPIRATION,
  }),
);
