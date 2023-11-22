import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Messages } from '../entities/messages.entity';
import { NewMessageInterface } from '../interfaces/messages.interface';

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
}
