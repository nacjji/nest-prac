import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { attachOffsetLimit } from 'src/function/common.function';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async isExist(id: number, userId: number) {
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
  }

  async getComment(
    articleId: number,
    parentId?: number,
    page?: number,
    per?: number,
  ) {
    const comment = await this.commentRepository.query(
      `SELECT 
        id, 
        content, 
        articleId, 
        parentId, 
        userId, 
        DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i') AS createdAt 
      FROM Comment 
      WHERE articleId = ${articleId}
      ${parentId ? `AND parentId = ${parentId}` : ``}
      ${attachOffsetLimit(page, per)}
      ORDER BY createdAt DESC`,
    );

    return comment;
  }

  async createComment(
    content: string,
    articleId: number,
    userId: number,
    parentId?: number,
  ) {
    const [isExistArticle] = await this.commentRepository.query(
      `SELECT 
        id 
      FROM Article 
      WHERE id = ${articleId}
      AND deletedAt IS NULL`,
    );

    if (!isExistArticle)
      throw new ConflictException('존재하지 않는 Article ID입니다.');

    const [isParent] = await this.commentRepository.query(
      `SELECT 
        id
      FROM Comment
      WHERE id = ${parentId}
      AND articleId = ${articleId}`,
    );

    if (!isParent) throw new ConflictException('존재하지 않는 댓글입니다.');

    await this.commentRepository.query(
      `INSERT INTO Comment(
          content, 
          parentId, 
          articleid, 
          userId) 
      VALUES(
        '${content}', 
        ${parentId ? parentId : 'NULL'}, 
        ${articleId}, 
        ${userId})`,
    );

    return;
  }

  async updateComment(id: number, content: string, userId: number) {
    await this.isExist(id, userId);
    await this.commentRepository.query(
      `UPDATE Comment 
      SET content = '${content}'
      WHERE id = ${id}`,
    );
  }

  async deleteComment(id: number, userId: number) {
    await this.isExist(id, userId);
    await this.commentRepository.query(
      `UPDATE Comment 
      SET deletedAt = NOW()
      WHERE id = ${id}`,
    );
  }
}
