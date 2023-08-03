import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { UserEntity } from './user.entity';

@Entity('Comment')
export class CommentEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  content: string;

  @Column('bigint', { unique: false, nullable: true })
  parentId: string | null;

  @Column('varchar', { unique: false, nullable: true })
  userId: string | null;

  @Column('bigint', { unique: false, nullable: false })
  articleId: string | null;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  @JoinColumn({ name: 'articleId', referencedColumnName: 'id' })
  article: ArticleEntity;
}
