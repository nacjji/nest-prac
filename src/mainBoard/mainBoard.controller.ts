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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { FileService } from 'src/file/file.service';
import { ReadUserDto } from 'src/user/user.dto';
import { commonParamValidator } from 'src/validator/common/commonParamValidator';
import { mainBoardDataValidator } from 'src/validator/mainBoardValidator/mainBoardDataValidator';
import {
  CreateMainBoardDto,
  DeleteMainBoardDto,
  ReadMainBoardDto,
  UpdateMainBoardDto,
} from './mainBoard.dto';
import { MainBoardService } from './mainBoard.service';

@ApiTags('MainBoard API')
@Controller('mainBoard')
export class MainBoardController {
  constructor(
    private readonly mainBoardService: MainBoardService,
    private readonly fileService: FileService,
  ) {}

  // MainBoard Create
  @ApiOperation({
    summary: 'MainBoard 작성 API',
    description: '유저가 Mainboard를 작성한다.',
  })
  @ApiBody({
    type: CreateMainBoardDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createMainBoard(
    @Body() body: CreateMainBoardDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { title, content } = body;
    const userId = user.id;
    try {
      await mainBoardDataValidator.validateAsync({ title, content });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    await this.mainBoardService.createMainBoard(title, content, userId, file);

    return response.status(201).json({
      code: 201,
      message: 'MainBoard을 생성했습니다.',
    });
  }

  @ApiOperation({
    summary: 'MainBoard 조회 API',
    description: '유저가 MainBoard 리스트 또는 상세내용을 조회한다.',
  })
  @Get()
  async getMainBoard(
    @Query() query: ReadMainBoardDto,
    @Res() response: Response,
  ) {
    try {
      await commonParamValidator.validateAsync({
        id: query.id,
        page: query.page,
        per: query.per,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const mainBoard = await this.mainBoardService.getMainBoard(
      query.id,
      query.page,
      query.per,
    );

    return response.status(200).json({
      code: 200,
      message: 'MainBoard를 불러왔습니다.',
      data: mainBoard,
    });
  }

  @ApiOperation({
    summary: 'MainBoard 수정 API',
    description: '유저가 MainBoard를 수정한다.',
  })
  @ApiBody({
    type: UpdateMainBoardDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateMainBoard(
    @Body() body: UpdateMainBoardDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id, title, content } = body;
    const userId = user.id;

    try {
      await mainBoardDataValidator
        .tailor('update')
        .validateAsync({ id, title, content });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    const mainBoard = await this.mainBoardService.updateMainBoard(
      id,
      title,
      content,
      userId,
      file,
    );
    return response.status(201).json({
      code: 201,
      message: 'MainBoard를 수정했습니다.',
      data: mainBoard,
    });
  }

  @ApiOperation({
    summary: 'MainBoard 삭제 API',
    description: '유저가 MainBoard을 삭제한다.',
  })
  @ApiBody({
    type: DeleteMainBoardDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteMainBoard(
    @Body() body: DeleteMainBoardDto,
    @User() user: ReadUserDto,
    @Res() response: Response,
  ) {
    const { id } = body;
    const userId = user.id;
    await this.mainBoardService.deleteMainBoard(id, userId);
    return response
      .status(201)
      .json({ code: 201, message: 'MainBoard 을 삭제했습니다.' });
  }
}
