import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { AnonyCommentEntity } from './anonyComment.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { FileEntity } from './file.entity';

@Entity('AnonyBoard')
export class AnonyBoardEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    example: 'AnonyBoard 제목',
    description: 'AnonyBoard 제목',
    required: true,
  })
  title: string;

  @Column('text', { unique: false, nullable: false })
  @ApiProperty({
    example: 'AnonyBoad 내용',
    description: 'AnonyBoad 내용',
    required: true,
  })
  content: string;

  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    description: '수정, 삭제에 사용되는 비밀번호',
    required: true,
  })
  password: string;

  @OneToMany(
    () => AnonyCommentEntity,
    (comment) => {
      comment.anonyBoard;
    },
  )
  @OneToMany(
    () => FileEntity,
    (file) => {
      file.anonyBoard;
    },
  )
  comments: AnonyCommentEntity;
  files: FileEntity;
}
