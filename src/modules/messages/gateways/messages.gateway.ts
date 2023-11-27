import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from '../services/messages.service';
import { InboxInterface } from '../interfaces/conversations.interface';
import { MessageInterface } from '../interfaces/messages.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('inbox')
  async inbox(
    @MessageBody() data: { userId: string },
  ): Promise<InboxInterface[]> {
    return this.messagesService.findAll(data.userId);
  }

  @SubscribeMessage('thread')
  async thread(
    @MessageBody() data: { id: string; userId: string },
  ): Promise<MessageInterface[]> {
    return this.messagesService.findOne(data.id, data.userId);
  }

  @SubscribeMessage('messageRequests')
  async messageRequests(
    @MessageBody() data: { userId: string },
  ): Promise<InboxInterface[]> {
    return this.messagesService.getRequests(data.userId);
  }
}
