import {
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
