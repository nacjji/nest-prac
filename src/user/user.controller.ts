import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
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
  @Get('user-info')
  async getUser(
    @User()
    user: {
      id: number;
      email: string;
      createdAt: string;
      updatedAt: string;
    },
  ) {
    return user;
  }
}
