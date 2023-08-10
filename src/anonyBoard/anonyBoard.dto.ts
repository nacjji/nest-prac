import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { AnonyBoardEntity } from 'src/entities/anonyBoard.entity';

export class ReadAnonyBoardDto extends CommonDto {}

export class CreateAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'title',
  'content',
  'password',
]) {}

export class UpdateAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'id',
  'title',
  'content',
  'password',
]) {}

export class DeleteAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'id',
  'password',
]) {}
