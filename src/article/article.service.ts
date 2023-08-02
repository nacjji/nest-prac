import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { attachOffsetLimit } from 'src/function/common.function';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(title: string, content: string, userId: number) {
    // Raw Query 사용하는 방식
    await this.articleRepository.query(
      `INSERT INTO Article(title, content, userId) VALUES('${title}', '${content}', ${userId}) `,
    );
  }

  async getArticle(articleId?: number, page?: number, per?: number) {
    const article = await this.articleRepository.query(
      `SELECT 
          id, 
          title, 
          ${articleId ? `content,` : ``}
          DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i') AS createdAt 
        FROM Article 
        WHERE deletedAt IS NULL
        ${articleId ? `AND id = ${articleId}` : ``}
        ORDER BY createdAt DESC, id DESC
        ${attachOffsetLimit(page, per)}`,
    );
    return article;
  }

  async updateArticle(
    id: number,
    title: string,
    content: string,
    userId: number,
  ) {
    const isExist = await this.articleRepository.query(
      `SELECT 
        * 
      FROM Article AS a
      WHERE a.id = ${id}
      AND a.deletedAt IS NULL`,
    );

    if (!isExist.length)
      throw new ConflictException('존재하지 않거나 삭제된 Article입니다.');
    if (isExist[0].userId !== userId)
      throw new ConflictException('작성자만 수정할 수 있습니다.');

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
  }

  async deleteArticle(id: number, userId: number) {
    const isExist = await this.articleRepository.query(
      `SELECT 
        * 
      FROM Article AS a
      WHERE a.id = ${id}
      AND a.deletedAt IS NULL`,
    );

    if (!isExist.length)
      throw new ConflictException('존재하지 않거나 삭제된 Article입니다.');
    if (isExist[0].userId !== userId)
      throw new ConflictException('작성자만 삭제할 수 있습니다.');

    await this.articleRepository.query(
      `UPDATE 
        Article 
      SET deletedAt = NOW() 
      WHERE id = ${id}`,
    );
  }
}
