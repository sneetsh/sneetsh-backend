import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Conversations,
  ConversationType,
} from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class ConversationRepository extends Repository<Conversations> {
  logger = new Logger(ConversationRepository.name);

  constructor(private dataSource: DataSource) {
    super(Conversations, dataSource.createEntityManager());
  }

  async saveConversation(
    user: User,
    recipient: User,
    convo_type?: ConversationType,
  ): Promise<Conversations> {
    try {
      return await this.save(
        this.create({
          convo_type,
          user,
          recipient,
          user_id: user.id,
          recipient_id: recipient.id,
        }),
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }

  async findDirectMessage(
    user_id: string,
    recipient_id: string,
  ): Promise<Conversations> {
    try {
      return await this.findOne({
        where: [
          { user_id: user_id },
          { user_id: recipient_id },
          { convo_type: ConversationType.DIRECT_MESSAGE },
        ],
      });
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }
}
