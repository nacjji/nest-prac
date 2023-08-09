import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { CommonBigPkEntity } from './common/common.entity';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';

@Entity('Article')
export class ArticleEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    example: 'Article 제목',
    description: 'Article 제목',
    required: true,
  })
  title: string;

  @Column('text', { unique: false, nullable: false })
  @ApiProperty({
    example: 'Article 내용',
    description: 'Article 내용',
    required: true,
  })
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
  @OneToMany(
    () => FileEntity,
    (file) => {
      file.article;
    },
  )
  comments: CommentEntity;
  files: FileEntity;
}
