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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { ReadUserDto } from 'src/user/user.dto';
import { articleDataValidator } from 'src/validator/articleValidator/articleDataValidator';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import {
  CreateArticleDto,
  DeleteArticleDto,
  ReadArticleDto,
  UpdateArticleDto,
} from './article.dto';
import { ArticleService } from './article.service';

@ApiTags('Article API')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({
    summary: 'Article 작성 API',
    description: '유저가 Article을 작성한다.',
  })
  @ApiBody({
    type: CreateArticleDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createArticle(
    @Body() body: CreateArticleDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
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

  @ApiOperation({
    summary: 'Article 조회 API',
    description: '유저가 Article 리스트 또는 상세내용을 조회한다.',
  })
  @Get()
  async getArticle(@Query() query: ReadArticleDto, @Res() response: Response) {
    try {
      await commonParamValidator.validateAsync({
        id: query.id,
        page: query.page,
        per: query.per,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const article = await this.articleService.getArticle(
      query.id,
      query.page,
      query.per,
    );

    return response
      .status(200)
      .json({ code: 200, message: 'Article을 불러왔습니다.', data: article });
  }

  @ApiOperation({
    summary: 'Article 수정 API',
    description: '유저가 Article을 수정한다.',
  })
  @ApiBody({
    type: UpdateArticleDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateArticle(
    @Body() body: UpdateArticleDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
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

  @ApiOperation({
    summary: 'Article 삭제 API',
    description: '유저가 Article을 삭제한다.',
  })
  @ApiBody({
    type: DeleteArticleDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteArticle(
    @Body() body: DeleteArticleDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
    const { id } = body;
    const userId = user.id;
    await this.articleService.deleteArticle(id, userId);
    return response
      .status(201)
      .json({ code: 201, message: 'Article 을 삭제했습니다.' });
  }
}
