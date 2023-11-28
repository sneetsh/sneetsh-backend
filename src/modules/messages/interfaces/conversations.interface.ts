import { User } from '../../user/entities/user.entity';
import {
  ConversationStatus,
  ConversationType,
} from '../entities/conversations.entity';

export interface ConversationInterface {
  id: string;
  user_id: string;
  status: ConversationStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user: User;
}

export interface InboxInterface {
  id: string;
  convo_type: ConversationType;
  message: string;
  created_at: Date;
  user_id: string;
  username: string;
  name: string;
}
