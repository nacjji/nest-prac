import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptionsFactory } from 'src/common/utils/multer.options.factory';
import { ArticleEntity } from 'src/entities/article.entity';
import { FileEntity } from 'src/entities/file.entity';
import { FileService } from 'src/file/file.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, FileEntity]),
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
  ],
  exports: [TypeOrmModule],
  controllers: [ArticleController],
  providers: [ArticleService, FileService],
})
export class ArticleModule {}
