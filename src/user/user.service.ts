import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // 회원가입
  async signup(email: string, password: string) {
    const isExist = await this.userRepository.findOne({ where: { email } });

    if (isExist) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const hashedPassword = await hash(password, 11);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
    });
    return user;
  }
}
