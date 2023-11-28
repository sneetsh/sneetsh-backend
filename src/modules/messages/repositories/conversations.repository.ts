import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  Conversations,
  ConversationStatus,
  ConversationType,
} from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';
import { InboxInterface } from '../interfaces/conversations.interface';

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

  async messageRequests(
    user_id: string,
    pagination: { skip: number; take: number },
    status = ConversationStatus.REQUESTED,
  ): Promise<InboxInterface[]> {
    try {
      return await this.query(
        `
        SELECT
        conv.id, conv.convo_type, msg.text AS message, msg.created_at AS created_at, msg.user_id, u.username, u.name
        FROM conversations conv
        JOIN (
          SELECT
          conversation_id, MAX(created_at) AS max_timestamp
          FROM messages
          GROUP BY conversation_id
        ) latest_msg_time
        ON conv.id = latest_msg_time.conversation_id
        JOIN messages msg
        ON latest_msg_time.conversation_id = msg.conversation_id
        AND latest_msg_time.max_timestamp = msg.created_at
        LEFT JOIN "public"."user" u
        ON u.id = msg.user_id
        WHERE
        conv.recipient_id = $1
        AND status = $2
        ORDER BY
        created_at DESC
        LIMIT $3
        OFFSET $4;
      `,
        [user_id, status, pagination.take, pagination.skip],
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }

  async inbox(
    user_id: string,
    pagination: { skip: number; take: number },
  ): Promise<InboxInterface[]> {
    try {
      return await this.query(
        `
        SELECT
        conv.id, conv.convo_type, msg.text AS message, msg.created_at AS created_at, msg.user_id, u.username, u.name
        FROM conversations conv
        JOIN (
          SELECT
          conversation_id, MAX(created_at) AS max_timestamp
          FROM messages
          GROUP BY conversation_id
        ) latest_msg_time
        ON conv.id = latest_msg_time.conversation_id
        JOIN messages msg
        ON latest_msg_time.conversation_id = msg.conversation_id
        AND latest_msg_time.max_timestamp = msg.created_at
        LEFT JOIN "public"."user" u
        ON u.id = msg.user_id
        LEFT JOIN conversation_participants CP
        ON CP.conversation_id = conv.id
        WHERE
        CP.user_id = $1
        AND status = $2
        ORDER BY
        created_at DESC
        LIMIT $3
        OFFSET $4;
      `,
        [
          user_id,
          ConversationStatus.ACCEPTED,
          pagination.take,
          pagination.skip,
        ],
      );
    } catch (error) {
      this.logger.error(error, error.message);
    }
  }
}
