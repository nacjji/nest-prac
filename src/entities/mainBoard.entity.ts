import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

@Entity('MainBoard')
export class MainBoardEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    example: 'MainBoard 제목',
    description: 'MainBoard 제목',
    required: true,
  })
  title: string;

  @Column('text', { unique: false, nullable: false })
  @ApiProperty({
    example: 'MainBoard 내용',
    description: 'MainBoard 내용',
    required: true,
  })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.mainBoards)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(
    () => CommentEntity,
    (comment) => {
      comment.mainBoard;
    },
  )
  @OneToMany(
    () => FileEntity,
    (file) => {
      file.mainBoard;
    },
  )
  comments: CommentEntity;
  files: FileEntity;
}
