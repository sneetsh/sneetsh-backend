import { User } from '../../user/entities/user.entity';
import { ConversationStatus } from '../entities/conversations.entity';

export interface ConversationInterface {
  id: string;
  user_id: string;
  status: ConversationStatus;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user: User;
}
