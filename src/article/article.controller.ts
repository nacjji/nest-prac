import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { articleDataValidator } from 'src/validator/articleValidator/articleDataValidator';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createArticle(@Body() body, @User() user, @Res() response: Response) {
    const { title, content } = body;
    const userId = user.id;
    try {
      await articleDataValidator.validateAsync({ title, content });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const article = await this.articleService.createArticle(
      title,
      content,
      userId,
    );
    return response.status(201).json({
      code: 201,
      message: 'Article을 생성했습니다.',
      articleId: article,
    });
  }

  @Get()
  async getArticle(
    @Query('id') id: number,
    @Query('page') page: number,
    @Query('per') per: number,
    @Res() response: Response,
  ) {
    try {
      await commonParamValidator.validateAsync({
        id,
        page,
        per,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const article = await this.articleService.getArticle(id, page, per);

    return response
      .status(200)
      .json({ code: 200, message: 'Article을 불러왔습니다.', data: article });
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateArticle(@Body() body, @User() user, @Res() response: Response) {
    const { id, title, content } = body;
    const userId = user.id;
    const article = await this.articleService.updateArticle(
      id,
      title,
      content,
      userId,
    );
    try {
      await articleDataValidator
        .tailor('update')
        .validateAsync({ id, title, content });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return response
      .status(201)
      .json({ code: 201, message: 'Article을 수정했습니다.', data: article });
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteArticle(@Body() body, @User() user, @Res() response: Response) {
    const { id } = body;
    const userId = user.id;
    await this.articleService.deleteArticle(id, userId);
    return response
      .status(201)
      .json({ code: 201, message: 'Article 을 삭제했습니다.' });
  }
}
