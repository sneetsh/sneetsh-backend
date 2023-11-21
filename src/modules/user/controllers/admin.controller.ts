import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserUpdateDto } from '../dtos';
import { User } from '../entities/user.entity';
import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { PermissionGuard } from '../../authentication/guards/permission.guard';
import { Permissions } from '../../authentication/decorators/permission.decorator';
import { USER } from '../../../common/constants';
import { GetUser } from '../../../common/decorators';
import { PaginationDTO } from '../../../common/dto';

@Controller('admin/users')
@UseGuards(UserAuthGuard)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Put('')
  @Permissions([USER.PERMISSIONS.ALL, USER.PERMISSIONS.UPDATE_STAFF])
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  updateUser(@Body() body: UserUpdateDto) {
    return this.userService.update(body);
  }

  @Get('')
  @Permissions([USER.PERMISSIONS.ALL, USER.PERMISSIONS.VIEW_STAFF])
  @UseGuards(PermissionGuard)
  async getUsers(@Query() pagination: PaginationDTO) {
    return this.userService.getUsers(pagination);
  }

  @Get('deleted')
  @Permissions([USER.PERMISSIONS.ALL, USER.PERMISSIONS.VIEW_STAFF])
  @UseGuards(PermissionGuard)
  async getDeletedUsers(@Query() pagination: PaginationDTO) {
    return this.userService.getDeleteUsers(pagination);
  }

  @Delete(':user_id')
  @Permissions([USER.PERMISSIONS.ALL, USER.PERMISSIONS.DELETE_STAFF])
  @UseGuards(PermissionGuard)
  async deleteUser(
    @Param('user_id', ParseUUIDPipe) user_id: string,
    @GetUser() user: User,
  ) {
    return this.userService.deleteUser(user_id, user);
  }

  @Get('/:user_id')
  @Permissions([USER.PERMISSIONS.ALL, USER.PERMISSIONS.VIEW_STAFF])
  @UseGuards(PermissionGuard)
  async getUser(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return this.userService.getUser(user_id);
  }
}
