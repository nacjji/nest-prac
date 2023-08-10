/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { AnonyBoardEntity } from './src/entities/anonyBoard.entity';
import { AnonyCommentEntity } from './src/entities/anonyComment.entity';
import { CommentEntity } from './src/entities/comment.entity';
import { FileEntity } from './src/entities/file.entity';
import { MainBoardEntity } from './src/entities/mainBoard.entity';
import { UserEntity } from './src/entities/user.entity';
dotenv.config({ path: `.env` });

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [
    UserEntity,
    MainBoardEntity,
    CommentEntity,
    FileEntity,
    AnonyBoardEntity,
    AnonyCommentEntity,
  ],
  synchronize: false,
  logging: true,
});
