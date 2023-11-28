import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { MEDIA_TYPE } from '../../../common/interfaces';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  cover: string;

  @Column()
  file: string;

  @Column()
  label: string;

  @Column()
  genre: string;

  @Column('simple-array', { default: '' })
  tags: string[];

  @Column()
  duration: string;

  @Column('double precision', { default: 0 })
  favorite_count: string;

  @Column('double precision', { default: 0 })
  download_count: string;

  @Column({ type: 'enum', enum: MEDIA_TYPE, nullable: true })
  type: string;

  @Column({ nullable: true })
  album: string;

  @Column('boolean', { default: false, select: false })
  status: boolean;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  feature_refs: string[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  update_at: string;

  @DeleteDateColumn({
    nullable: true,
    select: false,
  })
  deleted_at: string;

  @ManyToOne(() => User, (user) => user.media, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => User, (user) => user.featured)
  features: User[];
}
