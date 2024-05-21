import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'redis',
  (): RedisModuleOptions => ({
    config: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  }),
);
