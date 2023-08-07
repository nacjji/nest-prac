/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ArticleEntity } from './src/entities/article.entity';
import { CommentEntity } from './src/entities/comment.entity';
import { UserEntity } from './src/entities/user.entity';
dotenv.config({ path: `.env` });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [UserEntity, ArticleEntity, CommentEntity],
  synchronize: false,
  logging: true,
});
