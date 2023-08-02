import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(
    content: string,
    articleId: number,
    userId: number,
    parentId?: number, // 대댓글
  ) {
    await this.commentRepository.query(
      `INSERT INTO Comment(content, parentId, articleid, userId) 
      VALUES('${content}', 
      ${parentId ? `${parentId}` : `NULL`},
      ${articleId}, ${userId})`,
    );
    return;
  }
}
