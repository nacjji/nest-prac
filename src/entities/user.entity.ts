import { Column, Entity, OneToMany } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { CommonBigPkEntity } from './common/common.entity';

@Entity('User')
export class UserEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  email: string;

  @Column('varchar', { unique: true, nullable: false })
  nickname: string;

  @Column('varchar', { unique: false, nullable: false })
  password: string;

  @OneToMany(() => ArticleEntity, (article) => article.user)
  articles: ArticleEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
