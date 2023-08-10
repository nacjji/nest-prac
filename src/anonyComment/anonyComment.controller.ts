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
} from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

import { Response } from 'express';
import { DeleteAnonyBoardDto } from 'src/anonyBoard/anonyBoard.dto';
import { DeleteMainBoardDto } from 'src/mainBoard/mainBoard.dto';
import { anonyCommentDataValidator } from 'src/validator/anonyCommentValidataor/anonyCommentDataValidator';
import { anonyCommentParamValidator } from 'src/validator/anonyCommentValidataor/anonycommentParamValidator';

import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import {
  CreateAnonyCommentDto,
  ReadAnonyCommentDto,
  UpdateAnonyCommentDto,
} from './anonyComment.dto';
import { AnonyCommentService } from './anonyComment.service';

@Controller('anonyComment')
export class AnonyCommentController {
  constructor(private readonly anonyCommentService: AnonyCommentService) {}
  @ApiOperation({
    summary: '댓글 조회 API',
  })
  @Get()
  async getAnonyComment(
    @Query()
    query: ReadAnonyCommentDto,
    @Res() response: Response,
  ) {
    try {
      await commonParamValidator.validateAsync({
        page: query.page,
        per: query.per,
      });
      await anonyCommentParamValidator.validateAsync(query);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const comment = await this.anonyCommentService.getAnonyComment(
      query.anonyBoardId,
      query.parentId,
      query.page,
      query.per,
    );

    return response
      .status(200)
      .json({ code: 200, message: '댓글을 불러왔습니다.', data: comment });
  }

  @ApiOperation({
    summary: '댓글 작성 API',
    description: '유저가 댓글을 작성한다.',
  })
  @ApiBody({
    type: CreateAnonyCommentDto,
  })
  @Post()
  async createComment(
    @Body() body: CreateAnonyCommentDto,
    @Res() response: Response,
  ) {
    const data = body;
    try {
      await anonyCommentDataValidator.tailor('create').validateAsync(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.anonyCommentService.createAnonyComment(data);
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
    type: UpdateAnonyCommentDto,
  })
  @Put()
  async updateAnonyComment(
    @Body() body: UpdateAnonyCommentDto,
    @Res() response: Response,
  ) {
    const data = body;

    try {
      await anonyCommentDataValidator.tailor('update').validateAsync(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.anonyCommentService.updateAnonyComment(data);

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
  @Delete()
  async deleteAnonyComment(
    @Body() body: DeleteAnonyBoardDto,
    @Res() response: Response,
  ) {
    const data = body;
    await this.anonyCommentService.deleteAnonyComment(data);

    return response
      .status(201)
      .json({ code: 201, message: '댓글을 삭제했습니다.' });
  }
}
