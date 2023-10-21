import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/modules/user/entities/user.entity';
import { MEDIA_TYPE } from 'src/common/interfaces';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  cover: string;

  @Column()
  url: string;

  @Column()
  label: string;

  @Column()
  genre: string;

  @Column({ type: 'enum', enum: MEDIA_TYPE, nullable: true })
  type: string;

  @Column({ nullable: true })
  album: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  created_at: string;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  update_at: string;

  @DeleteDateColumn({
    nullable: true,
    select: false,
  })
  deleted_at: string;

  @ManyToOne(() => User, (user) => user.media, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User[];

  @ManyToMany(() => User, (user) => user.featured)
  features: User[];
}
