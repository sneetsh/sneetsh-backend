import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { Messages } from './messages.entity';

export enum ConversationStatus {
  REQUESTED = 'Requested',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export enum ConversationType {
  DIRECT_MESSAGE = 'Direct Message',
  GROUP = 'Group',
}

@Entity({ name: 'conversations' })
export class Conversations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', comment: "conversation's initiator" })
  user_id: string;

  @Column({ type: 'uuid' })
  recipient_id?: string;

  @Column({
    type: 'enum',
    enum: ConversationStatus,
    default: ConversationStatus.REQUESTED,
  })
  status: ConversationStatus;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.DIRECT_MESSAGE,
  })
  convo_type: ConversationType;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.conversations, { cascade: true })
  @JoinColumn({ name: 'user', foreignKeyConstraintName: 'FK_user_id' })
  user: User;

  @ManyToOne(() => User, (user) => user.conversations, { cascade: true })
  @JoinColumn({
    name: 'recipient',
    foreignKeyConstraintName: 'FK_recipient_id',
  })
  recipient?: User;

  @OneToMany(() => Messages, (messages) => messages.conversation)
  messages: Messages[];
}
