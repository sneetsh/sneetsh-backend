import { User } from '../../user/entities/user.entity';
import { Conversations } from '../entities/conversations.entity';

export interface NewMessageInterface {
  text: string;
  conversation: Conversations;
  user: User;
}

export interface MessageInterface {
  id: string;
  message: string;
  created_at: Date;
  user_id: string;
  username: string;
  name: string;
}
