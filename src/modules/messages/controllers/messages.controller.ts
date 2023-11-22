import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { User } from '../../user/entities/user.entity';
import { MessagesService } from '../services/messages.service';
import { NewMessageDTO } from '../dtos/new-message.dto';
import { GetUser } from '../../../common/decorators';
import { MessageRequestResponseDTO } from '../dtos/request-response.dto';

@Controller('messages')
@UseGuards(UserAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('requests')
  @HttpCode(HttpStatus.OK)
  async create(@Body() newMessageDTO: NewMessageDTO, @GetUser() user: User) {
    return this.messagesService.create(newMessageDTO, user);
  }

  @Get('requests')
  async requests(@GetUser() user: User) {
    return this.messagesService.getRequests(user);
  }

  @Put('requests/:id')
  async processRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() requestResponseDTO: MessageRequestResponseDTO,
    @GetUser() user: User,
  ) {
    return this.messagesService.processRequest(id, requestResponseDTO, user);
  }
}
