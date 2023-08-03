import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { CommentEntity } from 'src/entities/comment.entity';

export class ReadCommentDto extends CommonDto {
  articleId: number;
  parentId: number;
}

export class CreateCommentDto extends PickType(CommentEntity, [
  'content',
  'articleId',
  'parentId',
]) {}

export class UpdateCommentDto extends PickType(CommentEntity, [
  'id',
  'content',
]) {}

export class DeleteCommentDto extends PickType(CommentEntity, ['id']) {}
