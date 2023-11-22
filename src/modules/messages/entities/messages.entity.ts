import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Conversations } from './conversations.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'messages' })
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  conversation_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deleted_at: Date;

  @ManyToOne(() => Conversations, (conversations) => conversations.messages, {
    cascade: true,
  })
  @JoinColumn({
    name: 'conversations',
    foreignKeyConstraintName: 'FK_conversations_id',
  })
  conversation: Conversations;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  @JoinColumn({ name: 'user', foreignKeyConstraintName: 'FK_user_id' })
  user: User;
}
