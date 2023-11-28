import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConversationParticipants } from '../entities/conversation-participants.entity';
import { Conversations } from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class ConversationParticipantRepository extends Repository<ConversationParticipants> {
  logger = new Logger(ConversationParticipantRepository.name);

  constructor(private dataSource: DataSource) {
    super(ConversationParticipants, dataSource.createEntityManager());
  }

  async saveParticipant(user: User, conversation: Conversations) {
    try {
      return await this.save(
        this.create({
          conversation_id: conversation.id,
          user_id: user.id,
          conversation,
          user,
        }),
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }
}
