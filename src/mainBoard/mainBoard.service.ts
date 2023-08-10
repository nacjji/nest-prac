import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { MainBoardEntity } from 'src/entities/mainBoard.entity';
import { attachOffsetLimit } from 'src/function/common.function';
import { Repository } from 'typeorm';

@Injectable()
export class MainBoardService {
  constructor(
    @InjectRepository(MainBoardEntity)
    private readonly mainBoardRepository: Repository<MainBoardEntity>,

    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async isExist(id: number, userId: number) {
    const [isExist] = await this.mainBoardRepository.query(
      `SELECT 
        *
      FROM MainBoard 
      WHERE id = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExist)
      throw new ConflictException('존재하지 않거나 삭제된 MainBoard입니다.');

    if (isExist.userId !== userId)
      throw new ConflictException('작성자만 수정할 수 있습니다.');
  }

  async createMainBoard(
    title: string,
    content: string,
    userId: number,
    file: Express.Multer.File,
  ) {
    // Raw Query 사용하는 방식
    const res = await this.mainBoardRepository.query(
      `INSERT INTO MainBoard(title, content, userId) VALUES('${title}', '${content}', ${userId}) `,
    );

    await this.fileRepository.query(
      `INSERT INTO File(mainBoardId, filename, size)
      VALUES(${res.insertId}, '${file.filename}', ${file.size})`,
    );
  }

  async getMainBoard(mainBoardId?: number, page?: number, per?: number) {
    const mainBoard = await this.mainBoardRepository.query(
      `SELECT 
          a.id, 
          title, 
          u.nickname,
          ${mainBoardId ? `content,` : ``}
          ${mainBoardId ? `f.filename,` : ``}
          DATE_FORMAT(a.createdAt, '%Y-%m-%d %H:%i') AS createdAt 
        FROM MainBoard AS a
        LEFT JOIN User AS u ON u.id = a.userId
        LEFT JOIN File AS f ON f.mainBoardId = a.id
        WHERE a.deletedAt IS NULL
        ${mainBoardId ? `AND a.id = ${mainBoardId}` : ``}
        ORDER BY a.createdAt DESC, a.id DESC
        ${attachOffsetLimit(page, per)}`,
    );
    return mainBoard;
  }

  async updateMainBoard(
    id: number,
    title: string,
    content: string,
    userId: number,
    file: Express.Multer.File,
  ) {
    await this.isExist(id, userId);
    await this.mainBoardRepository.query(
      `UPDATE MainBoard 
      SET 
        title = '${title}',
        content= '${content}',
        updatedAt = NOW()
      WHERE id = ${id}
      AND deletedAt IS NULL
      `,
    );

    const [isExistFile] = await this.fileRepository.query(
      `SELECT 
        id 
      FROM File 
      WHERE mainBoardId = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExistFile && file)
      await this.fileRepository.query(
        `INSERT 
          File
        SET 
          filename = '${file.filename}',
          size = ${file.size},
          mainBoardId= ${id}
        `,
      );
    await this.fileRepository.query(
      `UPDATE File
      SET 
      ${
        file
          ? ` filename = '${file.filename}',
              size = ${file.size}`
          : ` deletedAt = NOW()`
      } 
      WHERE mainBoardId = ${id}
      AND deletedAt IS NULL
        `,
    );
  }

  async deleteMainBoard(id: number, userId: number) {
    await this.isExist(id, userId);

    // transaction 추가예정

    await this.mainBoardRepository.query(
      `UPDATE 
        MainBoard
      SET deletedAt = NOW()
      WHERE id = ${id}`,
    );

    await this.mainBoardRepository.query(
      `UPDATE 
        Comment
      SET deletedAt = NOW()
      WHERE mainBoardId = ${id}`,
    );

    await this.fileRepository.query(
      `UPDATE 
        File
      SET deletedAt = NOW()
      WHERE mainBoardId = ${id}`,
    );
  }
}
