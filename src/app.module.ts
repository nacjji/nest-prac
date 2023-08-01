/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        retryAttempts: 10,
        type: 'mysql',
        host: process.env.DB_HOST,
        port: 3306,
        database: 'users',
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        entities: [path.join(__dirname, 'entities/**/*.entity.{js, ts')],
        synchronize: false,
        logging: true,
        timezone: 'local',
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
