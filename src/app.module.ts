/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { AnonyBoardModule } from './anonyBoard/anonyBoard.module';
import { AnonyCommentModule } from './anonyComment/anonyComment.moudule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { undefinedToNullInterceptor } from './interceptors/undefinedToNull.interceptor';
import { MainBoardModule } from './mainBoard/mainBoard.module';
import { UserModule } from './user/user.module';
import { configValidator } from './validator/common/configValidator';
require('dotenv').config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: configValidator,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        retryAttempts: configService.get('NODE_ENV') === 'prod' ? 10 : 1,
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_NAME'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        entities: [path.join(__dirname, '/entities/**/*.entity.{js, ts}')],
        synchronize: false,
        logging: true,
        autoLoadEntities: true,
        timezone: 'local',
      }),
    }),
    UserModule,
    AuthModule,
    MainBoardModule,
    CommentModule,
    AnonyBoardModule,
    AnonyCommentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: undefinedToNullInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
