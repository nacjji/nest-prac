import { Column, Entity } from 'typeorm';
import { CommonPkEntity } from './common/common.entity';

@Entity('User')
export class UserEntity extends CommonPkEntity {
  @Column('varchar', { unique: false, nullable: false })
  email: string;
  @Column('varchar', { unique: false, nullable: false })
  password: string;
}
