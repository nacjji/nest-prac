import * as Joi from 'joi';

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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { anonyBoardDataValidator } from 'src/validator/anonyBoardValidator/anonyBoardDataValidator';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import {
  CreateAnonyBoardDto,
  DeleteAnonyBoardDto,
  ReadAnonyBoardDto,
  UpdateAnonyBoardDto,
} from './anonyBoard.dto';
import { AnonyBoardService } from './anonyBoard.service';

// Swagger
@ApiTags('AnonyBoard API')
@Controller('anonyBoard')
export class AnonyBoardController {
  constructor(private readonly anonyBoardService: AnonyBoardService) {}

  // AnonyBoard Create
  @ApiOperation({
    summary: 'AnonyBoard 작성 API',
    description: '유저가 AnonyBoard를 작성한다.',
  })
  // Body DTO 타입 설정
  @ApiBody({
    type: CreateAnonyBoardDto,
  })
  @Post()
  // 파일 업로더
  @UseInterceptors(FileInterceptor('file'))
  async createAnonyBoard(
    @Body() body: CreateAnonyBoardDto,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = body;

    try {
      await anonyBoardDataValidator.validateAsync(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    await this.anonyBoardService.createAnonyBoard(data, file);
    return response.status(201).json({
      code: 201,
      message: 'AnonyBoard을 생성했습니다.',
    });
  }

  // AnonyBoard Get
  @ApiOperation({
    summary: 'AnonyBoard 조회 API',
    description: '유저가 AnonyBoard 리스트 또는 상세내용을 조회한다.',
  })
  @Get()
  async getAnonyBoard(
    @Query() query: ReadAnonyBoardDto,
    @Res() response: Response,
  ) {
    const param = query;

    try {
      await commonParamValidator.validateAsync(param);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const anonyBoard = await this.anonyBoardService.getAnonyBoard(param);

    return response.status(200).json({
      code: 200,
      message: 'AnonyBoard을 불러왔습니다.',
      data: anonyBoard,
    });
  }

  @ApiOperation({
    summary: 'AnonyBoard 수정 API',
    description: '유저가 AnonyBoard를 수정한다.',
  })
  @ApiBody({
    type: UpdateAnonyBoardDto,
  })
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateAnonyBoard(
    @Body() body: UpdateAnonyBoardDto,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = body;

    try {
      await anonyBoardDataValidator.tailor('update').validateAsync(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    await this.anonyBoardService.updateAnonyBoard(data, file);
    return response.status(201).json({
      code: 201,
      message: 'AnonyBoard를 수정했습니다.',
    });
  }

  @ApiOperation({
    summary: 'AnonyBoard 삭제 API',
    description: '유저가 AnonyBoard를 삭제한다.',
  })
  @ApiBody({
    type: DeleteAnonyBoardDto,
  })
  @Delete()
  async deleteAnonyBoard(
    @Body() body: DeleteAnonyBoardDto,
    @Res() response: Response,
  ) {
    const data = body;

    try {
      await Joi.object({
        id: Joi.number()
          .required()
          .integer()
          .error(new Error('ID를 확인해주세요.')),
        password: Joi.string()
          .required()
          .error(new Error('비밀번호를 확인해주세요.')),
      }).validateAsync(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    await this.anonyBoardService.deleteAnonyBoard(data);
    return response.status(201).json({
      code: 201,
      message: 'AnonyBoard를 삭제했습니다.',
    });
  }
}
