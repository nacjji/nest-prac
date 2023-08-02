import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import * as dotenv from 'dotenv';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
dotenv.config({ path: `.env.dev` });

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  // 회원가입
  async signup(email: string, password: string) {
    const isExist = await this.userRepository.findOne({ where: { email } });

    if (isExist) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
    const hashedPassword = await hash(password, Number(process.env.SALT));

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });

    return user;
  }
}
