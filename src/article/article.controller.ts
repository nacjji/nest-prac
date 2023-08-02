import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createArticle(@Body() body, @User() user) {
    const { title, content } = body;
    const userId = user.id;
    const article = await this.articleService.createArticle(
      title,
      content,
      userId,
    );

    return article;
  }
}
