import { Column, Entity, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { MainBoardEntity } from './mainBoard.entity';

@Entity('User')
export class UserEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  email: string;

  @Column('varchar', { unique: true, nullable: false })
  nickname: string;

  @Column('varchar', { unique: false, nullable: false })
  password: string;

  @OneToMany(() => MainBoardEntity, (mainBoard) => mainBoard.user)
  mainBoards: MainBoardEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
