import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnonyCommentEntity } from 'src/entities/anonyComment.entity';
import { attachOffsetLimit } from 'src/function/common.function';
import { Repository } from 'typeorm';
import {
  CreateAnonyCommentDto,
  DeleteAnonyCommentDto,
  UpdateAnonyCommentDto,
} from './anonyComment.dto';

@Injectable()
export class AnonyCommentService {
  constructor(
    @InjectRepository(AnonyCommentEntity)
    private readonly anonyCommentRepository: Repository<AnonyCommentEntity>,
  ) {}

  async isExist(id: number, password: string) {
    const [isExist] = await this.anonyCommentRepository.query(
      `SELECT 
        *
      FROM AnonyComment 
      WHERE id = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExist)
      throw new ConflictException('존재하지 않거나 삭제된 댓글입니다.');

    if (isExist.password !== password)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');

    return isExist;
  }

  async getAnonyComment(
    anonyBoardId: number,
    parentId?: number,
    page?: number,
    per?: number,
  ) {
    const comment = await this.anonyCommentRepository.query(
      `SELECT 
        c.id, 
        content, 
        anonyBoardId, 
        parentId, 
        DATE_FORMAT(c.createdAt, '%Y-%m-%d %H:%i') AS createdAt 
      FROM AnonyComment AS c
      WHERE anonyBoardId = ${anonyBoardId}
      ${parentId ? `AND parentId = ${parentId}` : ``}
      ORDER BY c.createdAt DESC
      ${attachOffsetLimit(page, per)}`,
    );

    return comment;
  }

  async createAnonyComment(data: CreateAnonyCommentDto) {
    const [isExistAnonyBoard] = await this.anonyCommentRepository.query(
      `SELECT 
        id 
      FROM AnonyBoard 
      WHERE id = ${data.anonyBoardId}
      AND deletedAt IS NULL`,
    );

    if (!isExistAnonyBoard)
      throw new ConflictException('존재하지 않는 AnonyBoard ID입니다.');

    if (data.parentId) {
      const [isParent] = await this.anonyCommentRepository.query(
        `SELECT 
            id
        FROM AnonyComment
        WHERE id = ${data.parentId}
        AND anonyBoardId = ${data.anonyBoardId}`,
      );

      if (!isParent) throw new ConflictException('존재하지 않는 댓글입니다.');
    }

    await this.anonyCommentRepository.query(
      `INSERT AnonyComment
      SET content = '${data.content}', 
          parentId = ${data.parentId ? `${data.parentId}` : `NULL`},
          anonyBoardId = ${data.anonyBoardId},
          password = '${data.password}'`,
    );

    return;
  }

  async updateAnonyComment(data: UpdateAnonyCommentDto) {
    await this.isExist(data.id, data.password);
    await this.anonyCommentRepository.query(
      `UPDATE AnonyComment 
      SET content = '${data.content}'
      WHERE id = ${data.id}`,
    );
  }

  async deleteAnonyComment(data: DeleteAnonyCommentDto) {
    await this.isExist(data.id, data.password);
    await this.anonyCommentRepository.query(
      `UPDATE AnonyComment 
      SET deletedAt = NOW()
      WHERE id = ${data.id}`,
    );
  }
}
