import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { User } from '../../user/entities/user.entity';
import { MessagesService } from '../services/messages.service';
import { NewMessageDTO } from '../dtos/new-message.dto';
import { GetUser } from '../../../common/decorators';

@Controller('messages')
@UseGuards(UserAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('requests')
  @HttpCode(HttpStatus.OK)
  async create(@Body() newMessageDTO: NewMessageDTO, @GetUser() user: User) {
    return this.messagesService.create(newMessageDTO, user);
  }
}
