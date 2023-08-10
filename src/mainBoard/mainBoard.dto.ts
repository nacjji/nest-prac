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
