import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { getPagination } from '../../../common/helpers/websocket.helper';
import { InboxInterface } from '../interfaces/conversations.interface';
import { MessageInterface } from '../interfaces/messages.interface';
import { MessagesService } from '../services/messages.service';

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
    @MessageBody()
    data: {
      userId: string;
      pagination?: { page: string; limit: string };
    },
  ): Promise<InboxInterface[]> {
    const { userId, pagination } = data;
    const paginate = getPagination(pagination?.page, pagination?.limit);
    return this.messagesService.findAll(userId, paginate);
  }

  @SubscribeMessage('thread')
  async thread(
    @MessageBody()
    data: {
      id: string;
      userId: string;
      text: string;
      pagination?: { page: string; limit: string };
    },
  ): Promise<MessageInterface[]> {
    const { id, userId, text, pagination } = data;
    const paginate = getPagination(pagination?.page, pagination?.limit);

    if (text) {
      return this.messagesService.saveWebsocketMessage(
        id,
        text,
        userId,
        paginate,
      );
    }

    return this.messagesService.findOne(id, userId, paginate);
  }

  @SubscribeMessage('messageRequests')
  async messageRequests(
    @MessageBody()
    data: {
      userId: string;
      pagination?: { page: string; limit: string };
    },
  ): Promise<InboxInterface[]> {
    const { userId, pagination } = data;
    const paginate = getPagination(pagination?.page, pagination?.limit);
    return this.messagesService.getRequests(userId, paginate);
  }
}
