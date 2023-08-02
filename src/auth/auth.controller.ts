import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.services';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    const user = req.user;
    return this.authService.login(user);
  }
}