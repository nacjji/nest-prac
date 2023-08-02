import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
}
