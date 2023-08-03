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
import { commentDataValidator } from 'src/validator/commentValidator/commentDataValidator';
import { commentParamValidator } from 'src/validator/commentValidator/commentParamValidator';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComment(
    @Query('articleId') articleId: number,
    @Query('parentId') parentId: number,
    @Query('page') page: number,
    @Query('per') per: number,
    @Res() response: Response,
  ) {
    try {
      await commonParamValidator.validateAsync({ page, per });
      await commentParamValidator.validateAsync({ articleId, parentId });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const comment = await this.commentService.getComment(
      articleId,
      parentId,
      page,
      per,
    );

    return response
      .status(200)
      .json({ code: 200, message: '댓글을 불러왔습니다.', data: comment });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(@Body() body, @User() user, @Res() response: Response) {
    const { content, articleId } = body;
    const parentId = body?.parentId; // 대댓글일 경우
    const userId = user.id;

    try {
      await commentDataValidator.tailor('create').validateAsync({
        content,
        parentId,
        articleId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.commentService.createComment(
      content,
      articleId,
      userId,
      parentId,
    );
    return response.status(201).json({
      code: 201,
      message: '댓글을 작성했습니다.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateComment(@Body() body, @User() user, @Res() response: Response) {
    const { id, content } = body;
    const userId = user.id;

    try {
      await commentDataValidator
        .tailor('update')
        .validateAsync({ id, content });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.commentService.updateComment(id, content, userId);

    return response.status(201).json({
      code: 201,
      message: '댓글을 수정했습니다.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(@Body() body, @User() user, @Res() response: Response) {
    const { id } = body;
    const userId = user.id;

    await this.commentService.deleteComment(id, userId);

    return response
      .status(201)
      .json({ code: 201, message: '댓글을 삭제했습니다.' });
  }
}
