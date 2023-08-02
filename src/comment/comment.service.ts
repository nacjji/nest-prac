import { ConflictException, Injectable } from '@nestjs/common';
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

  async updateComment(id: number, content: string, userId: number) {
    const [isExist] = await this.commentRepository.query(
      `SELECT 
        *
      FROM Comment 
      WHERE id = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExist)
      throw new ConflictException('존재하지 않거나 삭제된 댓글입니다.');

    if (isExist.userId !== userId)
      throw new ConflictException('작성자만 수정할 수 있습니다.');

    await this.commentRepository.query(
      `UPDATE Comment 
      SET content = '${content}'
      WHERE id = ${id}`,
    );
  }
}
