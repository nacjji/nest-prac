import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body) {
    const { email, password } = body;

    return this.userService.signup(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  async getUser() {
    return 'user-info Page';
  }
}
