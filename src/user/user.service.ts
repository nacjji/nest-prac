import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async getHomeList() {
    return 'User home list';
  }
}
