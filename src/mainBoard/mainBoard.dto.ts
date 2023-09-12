// DTO 데이터 전송객체, 계층간 데이터 전송을 위해 모델 대신 사용되는 객체

import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { MainBoardEntity } from 'src/entities/mainBoard.entity';

export class ReadMainBoardDto extends CommonDto {}

export class CreateMainBoardDto extends PickType(MainBoardEntity, [
  'title',
  'content',
]) {}

export class UpdateMainBoardDto extends PickType(MainBoardEntity, [
  'id',
  'title',
  'content',
]) {}

export class DeleteMainBoardDto extends PickType(MainBoardEntity, ['id']) {}
