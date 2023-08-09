import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { FileEntity } from 'src/entities/file.entity';
import { attachOffsetLimit } from 'src/function/common.function';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}
  // constructor(
  //   @InjectRepository(ArticleEntity)
  //   private readonly articleRepository: Repository<ArticleEntity>,
  // ) {}

  async isExist(id: number, userId: number) {
    const [isExist] = await this.articleRepository.query(
      `SELECT 
        *
      FROM Article 
      WHERE id = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExist)
      throw new ConflictException('존재하지 않거나 삭제된 Article입니다.');

    if (isExist.userId !== userId)
      throw new ConflictException('작성자만 수정할 수 있습니다.');
  }

  async createArticle(
    title: string,
    content: string,
    userId: number,
    file: Express.Multer.File,
  ) {
    // Raw Query 사용하는 방식
    const res = await this.articleRepository.query(
      `INSERT INTO Article(title, content, userId) VALUES('${title}', '${content}', ${userId}) `,
    );

    await this.fileRepository.query(
      `INSERT INTO File(articleId, filename, size)
      VALUES(${res.insertId}, '${file.filename}', ${file.size})`,
    );
  }

  async getArticle(articleId?: number, page?: number, per?: number) {
    const article = await this.articleRepository.query(
      `SELECT 
          a.id, 
          title, 
          u.nickname,
          ${articleId ? `content,` : ``}
          ${articleId ? `f.filename,` : ``}
          DATE_FORMAT(a.createdAt, '%Y-%m-%d %H:%i') AS createdAt 
        FROM Article AS a
        LEFT JOIN User AS u ON u.id = a.userId
        LEFT JOIN File AS f ON f.articleId = a.id
        WHERE a.deletedAt IS NULL
        ${articleId ? `AND a.id = ${articleId}` : ``}
        ORDER BY a.createdAt DESC, a.id DESC
        ${attachOffsetLimit(page, per)}`,
    );
    return article;
  }

  async updateArticle(
    id: number,
    title: string,
    content: string,
    userId: number,
    file: Express.Multer.File,
  ) {
    await this.isExist(id, userId);
    await this.articleRepository.query(
      `UPDATE Article 
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
      WHERE articleId = ${id}
      AND deletedAt IS NULL`,
    );

    if (!isExistFile && file)
      await this.fileRepository.query(
        `INSERT 
          File
        SET 
          filename = '${file.filename}',
          size = ${file.size},
          articleId= ${id}
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
      WHERE articleId = ${id}
      AND deletedAt IS NULL
        `,
    );
  }

  async deleteArticle(id: number, userId: number) {
    await this.isExist(id, userId);

    // transaction 추가예정

    await this.articleRepository.query(
      `UPDATE 
        Article
      SET deletedAt = NOW()
      WHERE id = ${id}`,
    );

    await this.articleRepository.query(
      `UPDATE 
        Comment
      SET deletedAt = NOW()
      WHERE articleId = ${id}`,
    );

    await this.fileRepository.query(
      `UPDATE 
        File
      SET deletedAt = NOW()
      WHERE articleId = ${id}`,
    );
  }
}
