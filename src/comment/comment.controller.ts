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
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

import { Response } from 'express';
import { DeleteMainBoardDto } from 'src/mainBoard/mainBoard.dto';
import { ReadUserDto } from 'src/user/user.dto';

import { commentDataValidator } from 'src/validator/commentValidator/commentDataValidator';
import { commentParamValidator } from 'src/validator/commentValidator/commentParamValidator';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import {
  CreateCommentDto,
  ReadCommentDto,
  UpdateCommentDto,
} from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  // Swagger
  @ApiOperation({
    summary: '댓글 조회 API',
    description: '유저가 댓글을 조회한다.',
  })
  @Get()
  async getComment(
    @Query()
    query: ReadCommentDto,
    @Res() response: Response,
  ) {
    try {
      await commonParamValidator.validateAsync({
        page: query.page,
        per: query.per,
      });
      await commentParamValidator.validateAsync({
        mainBoardId: query.mainBoardId,
        parentId: query.parentId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const comment = await this.commentService.getComment(
      query.mainBoardId,
      query.parentId,
      query.page,
      query.per,
    );

    return response
      .status(200)
      .json({ code: 200, message: '댓글을 불러왔습니다.', data: comment });
  }

  // Swagger
  @ApiOperation({
    summary: '댓글 작성 API',
    description: '유저가 댓글을 작성한다.',
  })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() body: CreateCommentDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
    const content = body.content;
    const mainBoardId = Number(body.mainBoardId);
    const parentId = Number(body.parentId) || undefined; // 대댓글일 경우
    const userId = user.id;

    try {
      await commentDataValidator.tailor('create').validateAsync({
        content,
        parentId,
        mainBoardId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.commentService.createComment(
      content,
      mainBoardId,
      userId,
      parentId,
    );
    return response.status(201).json({
      code: 201,
      message: '댓글을 작성했습니다.',
    });
  }

  @ApiOperation({
    summary: '댓글 수정 API',
    description: '유저가 댓글을 수정한다.',
  })
  @ApiBody({
    type: UpdateCommentDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateComment(
    @Body() body: UpdateCommentDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
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

  @ApiOperation({
    summary: '댓글 삭제 API',
    description: '유저가 댓글을 삭제한다.',
  })
  @ApiBody({
    type: DeleteMainBoardDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteComment(
    @Body() body: DeleteMainBoardDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
    const { id } = body;
    const userId = user.id;

    await this.commentService.deleteComment(id, userId);

    return response
      .status(201)
      .json({ code: 201, message: '댓글을 삭제했습니다.' });
  }
}
