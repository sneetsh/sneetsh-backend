import { IsIn } from 'class-validator';
import { ConversationStatus } from '../entities/conversations.entity';

export class MessageRequestResponseDTO {
  @IsIn(
    Object.values(ConversationStatus).filter((status) => status != 'Requested'),
  )
  status: string;
}
