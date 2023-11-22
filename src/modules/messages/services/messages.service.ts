import {
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
  Conversations,
} from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationRepository } from '../repositories/conversations.repository';
import { ConversationParticipantRepository } from '../repositories/conversation-participants.repository';
import { MessageRepository } from '../repositories/messages.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { MessageRequestResponseDTO } from '../dtos/request-response.dto';
import { NewMessageDTO } from '../dtos/new-message.dto';

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

  async create(newMessageDTO: NewMessageDTO, user: User) {
    try {
      // * should be removed if chats can be used for personal notes
      if (newMessageDTO.recipient === user.id) {
        throw new ForbiddenException(
          'You cannot start a conversation with yourself',
        );
      }

      let conversation = await this.conversationRepository.findOne({
        where: [
          {
            user_id: user.id,
            recipient_id: newMessageDTO.recipient,
            convo_type: ConversationType.DIRECT_MESSAGE,
          },
        ],
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
          id: newMessageDTO.recipient,
        });
        conversation = await this.conversationRepository.saveConversation(
          user,
          recipient,
        );
        await this.convoParticipantRepo.saveParticipant(user, conversation);
      }

      await this.messageRepository.saveMessage({
        text: newMessageDTO.text,
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

  async getRequests(user: User): Promise<Partial<Conversations>[]> {
    try {
      return await this.conversationRepository.find({
        where: {
          recipient_id: user.id,
          status: ConversationStatus.REQUESTED,
        },
        relations: {
          user: true,
          messages: true,
        },
        select: {
          id: true,
          convo_type: true,
          created_at: true,
          user: {
            id: true,
            username: true,
            name: true,
          },
          messages: {
            text: true,
          },
        },
        order: {
          created_at: 'DESC',
        },
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
}
