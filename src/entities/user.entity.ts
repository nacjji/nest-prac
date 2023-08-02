import { Column, Entity } from 'typeorm';
import { CommonBigPkEntity } from './common/common.entity';

@Entity('User')
export class UserEntity extends CommonBigPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  email: string;
  @Column('varchar', { unique: false, nullable: false })
  password: string;
}
