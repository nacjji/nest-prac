/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
dotenv.config({ path: `.env.dev` });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [path.join(__dirname, 'src/entities/**/*.entity.js')],
  synchronize: false,
  logging: true,
});
