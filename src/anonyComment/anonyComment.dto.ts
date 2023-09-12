import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { AnonyCommentEntity } from 'src/entities/anonyComment.entity';

export class ReadAnonyCommentDto extends CommonDto {
  anonyBoardId: number;
  parentId: number;
}

export class CreateAnonyCommentDto extends PickType(AnonyCommentEntity, [
  'content',
  'anonyBoardId',
  'parentId',
  'password',
]) {}

export class UpdateAnonyCommentDto extends PickType(AnonyCommentEntity, [
  'id',
  'content',
  'password',
]) {}

export class DeleteAnonyCommentDto extends PickType(AnonyCommentEntity, [
  'id',
  'password',
]) {}
