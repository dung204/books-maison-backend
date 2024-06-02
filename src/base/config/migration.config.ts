import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/base/database/migrations/*{.ts,.js}'],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
