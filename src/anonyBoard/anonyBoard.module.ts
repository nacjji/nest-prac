import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptionsFactory } from 'src/common/utils/multer.options.factory';
import { AnonyBoardEntity } from 'src/entities/anonyBoard.entity';
import { FileEntity } from 'src/entities/file.entity';
import { FileService } from 'src/file/file.service';
import { AnonyBoardController } from './anonyBoard.contorller';
import { AnonyBoardService } from './anonyBoard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnonyBoardEntity, FileEntity]),
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
  ],
  exports: [TypeOrmModule],
  controllers: [AnonyBoardController],
  providers: [AnonyBoardService, FileService],
})
export class AnonyBoardModule {}
