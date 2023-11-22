import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  ConversationStatus,
  ConversationType,
} from '../entities/conversations.entity';
import { User } from '../../user/entities/user.entity';
import { ConversationRepository } from '../repositories/conversations.repository';
import { ConversationParticipantRepository } from '../repositories/conversation-participants.repository';
import { MessageRepository } from '../repositories/messages.repository';
import { NewMessageDTO } from '../dtos/new-message.dto';
import { UserRepository } from '../../user/repositories/user.repository';

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
      let conversation = await this.conversationRepository.findOne({
        where: [
          { user_id: user.id },
          { user_id: newMessageDTO.recipient },
          { convo_type: ConversationType.DIRECT_MESSAGE },
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
}
