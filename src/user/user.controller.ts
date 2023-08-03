import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserModel } from 'src/interface/user.interface';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body) {
    const { email, password, nickname } = body;

    return this.userService.signup(email, password, nickname);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(
    @User()
    user: UserModel,
  ) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(
    @User() user: UserModel,
    @Body() body: { nickname: string },
    @Res() resoponse: Response,
  ) {
    const { nickname } = body;
    const userId = user.id;

    await this.userService.updateUser(userId, nickname);
    return resoponse
      .status(201)
      .json({ code: 201, message: '회원정보를 수정했습니다.' });
  }
}
