import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnonyBoardEntity } from 'src/entities/anonyBoard.entity';
import { AnonyCommentEntity } from 'src/entities/anonyComment.entity';
import { FileEntity } from 'src/entities/file.entity';
import { Repository } from 'typeorm';
import {
  CreateAnonyBoardDto,
  DeleteAnonyBoardDto,
  ReadAnonyBoardDto,
  UpdateAnonyBoardDto,
} from './anonyBoard.dto';

@Injectable()
export class AnonyBoardService {
  constructor(
    @InjectRepository(AnonyBoardEntity)
    private readonly anonyBoardRepository: Repository<AnonyBoardEntity>,

    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,

    @InjectRepository(AnonyCommentEntity)
    private readonly anonyCommentRepository: Repository<AnonyCommentEntity>,
  ) {}

  async isExist(id: number, password?: string) {
    const [isExist] = await this.anonyBoardRepository.query(
      `SELECT 
        *
      FROM AnonyBoard 
      WHERE id = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExist)
      throw new ConflictException('존재하지 않거나 삭제된 AnonyBoard입니다.');
    if (password && isExist.password !== password)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    return isExist;
  }

  async createAnonyBoard(data: CreateAnonyBoardDto, file: Express.Multer.File) {
    const res = await this.anonyBoardRepository.query(
      `INSERT 
            AnonyBoard 
        SET 
            title = '${data.title}',
            content = '${data.content}',
            password =  '${data.password}'`,
    );

    if (file)
      await this.fileRepository.query(
        `INSERT 
            File
        SET
            anonyBoardId =${res.insertId},
            filename = '${file.filename}', 
            size = ${file.size}`,
      );

    return;
  }

  async getAnonyBoard(param: ReadAnonyBoardDto) {
    if (param.id) {
      const isExist = await this.isExist(param.id);

      if (!isExist)
        throw new ConflictException('존재하지 않거나 삭제된 AnonyBoard입니다.');
    }
    const res = this.anonyBoardRepository.query(
      `SELECT 
            a.id, 
            title,
            f.filename,
            a.createdAt 
            ${param.id ? `,content` : ``}
        FROM AnonyBoard AS a
        LEFT JOIN File AS f ON anonyBoardId = a.id
        WHERE a.deletedAt IS NULL
        ${param.id ? `AND a.id =${param.id}` : ``}`,
    );

    return res;
  }
  async updateAnonyBoard(data: UpdateAnonyBoardDto, file: Express.Multer.File) {
    await this.isExist(data.id, data.password);
    await this.anonyBoardRepository.query(
      `UPDATE 
            AnonyBoard
        SET 
            title = '${data.title}',
            content = '${data.content}',
            updatedAt = NOW()
        WHERE id = ${data.id}`,
    );

    const [isExistFile] = await this.fileRepository.query(
      `SELECT 
          id 
        FROM File 
        WHERE anonyBoardId = ${data.id}
        AND deletedAt IS NULL`,
    );

    if (!isExistFile && file)
      await this.fileRepository.query(
        `INSERT 
            File
          SET 
            filename = '${file.filename}',
            size = ${file.size},
            anonyBoardId= ${data.id}`,
      );

    await this.fileRepository.query(
      `UPDATE 
            File
        SET 
        ${
          file
            ? ` filename = '${file.filename}',
                size = ${file.size}`
            : ` deletedAt = NOW()`
        } 
        WHERE anonyBoardId = ${data.id}`,
    );
  }
  async deleteAnonyBoard(data: DeleteAnonyBoardDto) {
    await this.isExist(data.id, data.password);
    await this.anonyBoardRepository.query(
      `UPDATE 
            AnonyBoard
        SET 
            deletedAt = NOW()
        WHERE id = ${data.id}`,
    );

    await this.anonyCommentRepository.query(
      `UPDATE 
            AnonyComment
        SET
            deletedAt = NOW()
        WHERE anonyBoardId = ${data.id}`,
    );

    await this.fileRepository.query(
      `UPDATE 
            File
        SET 
            deletedAt = NOW()
        WHERE anonyBoardId = ${data.id}`,
    );

    return;
  }
}
