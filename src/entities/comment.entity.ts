import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonBigPkEntity } from './common/common.entity';
import { MainBoardEntity } from './mainBoard.entity';
import { UserEntity } from './user.entity';

@Entity('Comment')
export class CommentEntity extends CommonBigPkEntity {
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

  @Column('varchar', { unique: false, nullable: true })
  userId: string | null;

  @Column('bigint', { unique: false, nullable: false })
  @ApiProperty({
    example: 'MainBoard ID',
    description: 'MainBoard ID',
    required: true,
  })
  mainBoardId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => MainBoardEntity, (mainBoard) => mainBoard.comments)
  @JoinColumn({ name: 'mainBoardId', referencedColumnName: 'id' })
  mainBoard: MainBoardEntity;
}
