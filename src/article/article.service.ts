import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(title: string, content: string, userId: string) {
    // Raw Query 사용하는 방식
    const article = await this.articleRepository.query(
      `INSERT INTO Article(title, content, userId) VALUES('${title}', '${content}', ${userId}) `,
    );

    return article;
  }
}
