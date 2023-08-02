import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body) {
    const { email, password } = body;

    return this.userService.signup(email, password);
  }
}
