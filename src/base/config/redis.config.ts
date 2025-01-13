import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs(
  'redis',
  (): RedisModuleOptions => ({
    config: {
      host: process.env.REDIS_HOST!,
      port: +process.env.REDIS_PORT!,
      password: process.env.REDIS_PASSWORD!,
    },
  }),
);
