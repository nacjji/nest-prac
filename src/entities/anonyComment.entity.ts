import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AnonyBoardEntity } from './anonyBoard.entity';
import { CommonBigPkEntity } from './common/common.entity';

@Entity('AnonyComment')
export class AnonyCommentEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용',
    required: true,
  })
  content: string;

  @Column('bigint', { unique: false, nullable: true })
  @ApiProperty({
    example: '원댓글 ID',
    description: '원댓글 ID',
    required: true,
  })
  parentId: string | null;

  @Column('bigint', { unique: false, nullable: false })
  @ApiProperty({
    example: 'AnonyBoard ID',
    description: 'AnonyBoard ID',
    required: true,
  })
  anonyBoardId: string | null;

  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    description: '수정, 삭제에 사용되는 비밀번호',
    required: true,
  })
  password: string | null;

  @ManyToOne(() => AnonyBoardEntity, (anonyBoard) => anonyBoard.comments)
  @JoinColumn({ name: 'anonyBoardId', referencedColumnName: 'id' })
  anonyBoard: AnonyBoardEntity;
}
