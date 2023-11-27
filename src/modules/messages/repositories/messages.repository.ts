import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Messages } from '../entities/messages.entity';
import {
  MessageInterface,
  NewMessageInterface,
} from '../interfaces/messages.interface';

@Injectable()
export class MessageRepository extends Repository<Messages> {
  logger = new Logger(MessageRepository.name);

  constructor(private dataSource: DataSource) {
    super(Messages, dataSource.createEntityManager());
  }

  async saveMessage(newMessage: NewMessageInterface): Promise<Messages> {
    try {
      return await this.save(
        this.create({
          ...newMessage,
          user_id: newMessage.user.id,
          conversation_id: newMessage.conversation.id,
        }),
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }

  async getMessages(
    conversation_id: string,
    user_id: string,
  ): Promise<MessageInterface[]> {
    try {
      return await this.query(
        `
      SELECT
       msg.id, text AS message, msg.created_at, user_id, u.username, u.name
      FROM messages msg
      LEFT JOIN "public"."user" u
       ON u.id = msg.user_id
      WHERE conversation_id = $1
       AND $2 IN (
        SELECT
         user_id
        FROM conversation_participants
        WHERE conversation_id = $1
      );
      `,
        [conversation_id, user_id],
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }
}
