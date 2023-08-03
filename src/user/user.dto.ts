import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from 'src/entities/user.entity';

export class CreateUserDto extends PickType(UserEntity, [
  'email',
  'nickname',
  'password',
]) {}

export class UpdateUserDto extends PickType(UserEntity, ['nickname']) {}

export class ReadUserDto extends PickType(UserEntity, ['id']) {}
