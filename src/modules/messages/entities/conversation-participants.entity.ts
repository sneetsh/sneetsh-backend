import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Conversations } from './conversations.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'conversation_participants' })
@Unique('UQ_user_id_conversation_id', ['user_id', 'conversation_id'])
export class ConversationParticipants extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', comment: "conversation's initiator" })
  user_id: string;

  @Column({ type: 'uuid', nullable: false })
  conversation_id: string;

  @ManyToOne(() => User, (user) => user.conversations, { cascade: true })
  @JoinColumn({ name: 'user', foreignKeyConstraintName: 'FK_user_id' })
  user: User;

  @ManyToOne(() => Conversations, (conversations) => conversations.messages, {
    cascade: true,
  })
  @JoinColumn({
    name: 'conversations',
    foreignKeyConstraintName: 'FK_conversations_id',
  })
  conversation: Conversations;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deleted_at: Date;
}
