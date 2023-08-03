import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.services';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인 API',
    description: '사용자가 로컬 로그인을 합니다.',
  })
  @ApiBody({})
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    const user = req.user;
    return this.authService.login(user);
  }
}
