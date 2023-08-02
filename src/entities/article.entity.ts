import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { UserEntity } from './user.entity';

@Entity('Article')
export class ArticleEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  title: string;

  @Column('text', { unique: false, nullable: false })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @OneToMany(
    () => CommentEntity,
    (comment) => {
      comment.article;
    },
  )
  comments: CommentEntity;
}
