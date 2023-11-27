import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from '../services/messages.service';
import { InboxInterface } from '../interfaces/conversations.interface';

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
}
