import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnonyCommentEntity } from 'src/entities/anonyComment.entity';
import { AnonyCommentController } from './anonyComment.controller';
import { AnonyCommentService } from './anonyComment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnonyCommentEntity])],
  exports: [TypeOrmModule],
  controllers: [AnonyCommentController],
  providers: [AnonyCommentService],
})
export class AnonyCommentModule {}
