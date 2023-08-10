import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonBigPkEntity } from './common/common.entity';
import { MainBoardEntity } from './mainBoard.entity';

@Entity('File')
export class FileEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  @ApiProperty({
    example: '파일 이름',
    description: '파일 이름',
    required: true,
  })
  filename: string;

  @Column('integer', { unique: false, nullable: false })
  @ApiProperty({
    example: '파일 사이즈',
    description: '파일 사이즈',
    required: true,
  })
  size: number;

  @ManyToOne(() => MainBoardEntity, (mainBoard) => mainBoard.files)
  @JoinColumn({ name: 'mainBoardId', referencedColumnName: 'id' })
  mainBoard: MainBoardEntity;
}
