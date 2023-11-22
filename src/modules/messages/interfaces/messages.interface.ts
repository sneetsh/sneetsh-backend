import { User } from '../../user/entities/user.entity';
import { Conversations } from '../entities/conversations.entity';

export interface NewMessageInterface {
  text: string;
  conversation: Conversations;
  user: User;
}
