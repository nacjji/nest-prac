import { PickType } from '@nestjs/mapped-types';
import { CommonDto } from 'src/dto/common.dto';
import { AnonyBoardEntity } from 'src/entities/anonyBoard.entity';

/*
  DTO(Data Transfer Object) : 계층(브라우저 - 컨트롤러 - 서비스 - 데이터베이스) 간 데이터 전송을 위해 도메인 모델 대신 사용되는 객체
*/

export class ReadAnonyBoardDto extends CommonDto {}

export class CreateAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'title',
  'content',
  'password',
]) {}

export class UpdateAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'id',
  'title',
  'content',
  'password',
]) {}

export class DeleteAnonyBoardDto extends PickType(AnonyBoardEntity, [
  'id',
  'password',
]) {}
