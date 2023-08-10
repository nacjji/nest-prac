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
    return isExist;
  }

  async getComment(
    mainBoardId: number,
    parentId?: number,
    page?: number,
    per?: number,
  ) {
    const comment = await this.commentRepository.query(
      `SELECT 
        c.id, 
        u.nickname,
        content, 
        mainBoardId, 
        parentId, 
        userId, 
        DATE_FORMAT(c.createdAt, '%Y-%m-%d %H:%i') AS createdAt 
      FROM Comment AS c
      LEFT JOIN User AS u ON u.id = c.userId
      WHERE mainBoardId = ${mainBoardId}
      ${parentId ? `AND parentId = ${parentId}` : ``}
      ORDER BY c.createdAt DESC
      ${attachOffsetLimit(page, per)}`,
    );

    return comment;
  }

  async createComment(
    content: string,
    mainBoardId: number,
    userId: number,
    parentId?: number,
  ) {
    const [isExistMainBoard] = await this.commentRepository.query(
      `SELECT 
        id 
      FROM MainBoard 
      WHERE id = ${mainBoardId}
      AND deletedAt IS NULL`,
    );

    if (!isExistMainBoard)
      throw new ConflictException('존재하지 않는 MainBoard ID입니다.');

    if (parentId) {
      const [isParent] = await this.commentRepository.query(
        `SELECT 
        id
      FROM Comment
      WHERE id = ${parentId}
      AND mainBoardId = ${mainBoardId}`,
      );

      if (!isParent) throw new ConflictException('존재하지 않는 댓글입니다.');
    }

    await this.commentRepository.query(
      `INSERT INTO Comment(
          content, 
          parentId, 
          mainBoardId, 
          userId) 
      VALUES(
        '${content}', 
        ${parentId ? parentId : 'NULL'}, 
        ${mainBoardId}, 
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
