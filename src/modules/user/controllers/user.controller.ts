import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';

import { UserService } from '../services/user.service';
import { UserUpdateDto } from '../dtos';
import { User } from '../entities/user.entity';

import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { GetUser } from '../../../common/decorators';

@Controller('users')
@UseGuards(UserAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async getUser(@GetUser() { id }: User) {
    return this.userService.getUser(id);
  }

  @Put('')
  updateUser(@Body() body: UserUpdateDto, @GetUser() { id }: User) {
    return this.userService.update({ user_id: id, ...body });
  }
}
