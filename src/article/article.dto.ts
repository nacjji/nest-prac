import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { ArticleEntity } from 'src/entities/article.entity';

export class ReadArticleDto extends CommonDto {}

export class CreateArticleDto extends PickType(ArticleEntity, [
  'title',
  'content',
]) {}

export class UpdateArticleDto extends PickType(ArticleEntity, [
  'id',
  'title',
  'content',
]) {}

export class DeleteArticleDto extends PickType(ArticleEntity, ['id']) {}
