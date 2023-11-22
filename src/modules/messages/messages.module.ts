import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ConversationParticipantRepository } from './repositories/conversation-participants.repository';
import { ConversationRepository } from './repositories/conversations.repository';
import { MessageRepository } from './repositories/messages.repository';
import { MessagesService } from './services/messages.service';
import { MessagesController } from './controllers/messages.controller';

@Module({
  imports: [UserModule],
  controllers: [MessagesController],
  providers: [
    ConversationParticipantRepository,
    ConversationRepository,
    MessageRepository,

    MessagesService,
  ],
})
export class MessagesModule {}
