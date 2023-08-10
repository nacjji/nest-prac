import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptionsFactory } from 'src/common/utils/multer.options.factory';
import { FileEntity } from 'src/entities/file.entity';
import { MainBoardEntity } from 'src/entities/mainBoard.entity';
import { FileService } from 'src/file/file.service';
import { MainBoardController } from './mainBoard.controller';
import { MainBoardService } from './mainBoard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MainBoardEntity, FileEntity]),
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
  ],
  exports: [TypeOrmModule],
  controllers: [MainBoardController],
  providers: [MainBoardService, FileService],
})
export class MainBoardModule {}
