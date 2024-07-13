import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config({ path: ['.env.local', '.env'] });

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/database/migrations/*{.ts,.js}'],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});
