import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Not } from 'typeorm';
import {
  ConversationStatus,
  ConversationType,
} from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationRepository } from '../repositories/conversations.repository';
import { ConversationParticipantRepository } from '../repositories/conversation-participants.repository';
import { MessageRepository } from '../repositories/messages.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { InboxInterface } from '../interfaces/conversations.interface';
import { MessageInterface } from '../interfaces/messages.interface';
import { MessageRequestResponseDTO } from '../dtos/request-response.dto';
import { MessageRequestDTO, NewMessageDTO } from '../dtos/new-message.dto';

@Injectable()
export class MessagesService {
  logger = new Logger(MessagesService.name);
  FAILURE_MESSAGE = 'Unable to process request';

  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly convoParticipantRepo: ConversationParticipantRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(messageRequestDTO: MessageRequestDTO, user: User) {
    try {
      // * should be removed if chats can be used for personal notes
      if (messageRequestDTO.recipient === user.id) {
        throw new ForbiddenException(
          'You cannot start a conversation with yourself',
        );
      }

      let conversation = await this.conversationRepository.findOne({
        where: {
          user_id: user.id,
          recipient_id: messageRequestDTO.recipient,
          convo_type: ConversationType.DIRECT_MESSAGE,
        },
      });
      if (conversation) {
        switch (conversation.status) {
          case ConversationStatus.REQUESTED:
            throw new ForbiddenException(
              'Awaiting response to pending request',
            );
          case ConversationStatus.REJECTED:
            throw new ForbiddenException('Pending request rejected');
        }
      } else {
        const recipient = await this.userRepository.findOneBy({
          id: messageRequestDTO.recipient,
        });
        conversation = await this.conversationRepository.saveConversation(
          user,
          recipient,
        );
        await this.convoParticipantRepo.saveParticipant(user, conversation);
      }

      await this.messageRepository.saveMessage({
        text: messageRequestDTO.text,
        conversation,
        user,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(this.FAILURE_MESSAGE);
      }
    }
  }

  async getRequests(user: User): Promise<InboxInterface[]> {
    try {
      return await this.conversationRepository.messageRequests(user.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(this.FAILURE_MESSAGE);
    }
  }

  async processRequest(
    id: string,
    requestResponseDTO: MessageRequestResponseDTO,
    user: User,
  ) {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: {
          id,
          recipient_id: user.id,
          status: Not(ConversationStatus.ACCEPTED),
          convo_type: ConversationType.DIRECT_MESSAGE,
        },
      });
      if (!conversation) {
        throw new NotFoundException('Message request not found');
      }

      switch (requestResponseDTO.status) {
        case ConversationStatus.ACCEPTED:
          conversation.status = requestResponseDTO.status;
          await this.convoParticipantRepo.saveParticipant(user, conversation);
          break;
        case ConversationStatus.REJECTED:
          conversation.status = requestResponseDTO.status;
          break;
      }
      await conversation.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(this.FAILURE_MESSAGE);
      }
    }
  }

  async findAll(user: User): Promise<InboxInterface[]> {
    try {
      return await this.conversationRepository.inbox(user.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(this.FAILURE_MESSAGE);
    }
  }

  async findOne(id: string, user: User): Promise<MessageInterface[]> {
    try {
      return await this.messageRepository.getMessages(id, user.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(this.FAILURE_MESSAGE);
    }
  }

  async saveMessage(
    id: string,
    newMessageDTO: NewMessageDTO,
    user: User,
  ): Promise<MessageInterface[]> {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: {
          id,
          status: ConversationStatus.ACCEPTED,
        },
      });

      if (!conversation) {
        throw new BadRequestException('Conversation does not exist');
      }

      await this.messageRepository.saveMessage({
        text: newMessageDTO.text,
        conversation,
        user,
      });

      return await this.messageRepository.getMessages(id, user.id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        this.logger.error(error);
        throw new InternalServerErrorException(this.FAILURE_MESSAGE);
      }
    }
  }
}
