import { ConflictException, Injectable } from '@nestjs/common';
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
  ) {}

  // 회원가입
  async signup(email: string, password: string, nickname: string) {
    const isExistEmail = await this.userRepository.findOne({
      where: { email },
    });

    const isExistNickname = await this.userRepository.findOne({
      where: { nickname },
    });

    if (isExistEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    if (isExistNickname) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    const hashedPassword = await hash(password, 11);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      nickname,
    });

    return user;
  }

  async updateUser(id: number, nickname: string) {
    const isExistNickname = await this.userRepository.findOne({
      where: { nickname },
    });

    if (isExistNickname) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    await this.userRepository.query(
      `UPDATE User
      SET nickname = '${nickname}'
      WHERE id = ${id}`,
    );
  }
}
