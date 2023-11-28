import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateRoleDto, UpdateRoleDTO } from '../dtos';
import { AssignRoleDTO } from '../dtos/assign-role.dto';

import { RoleService } from '../services/role.service';

import { ROLE } from '../../../common/constants/permissions.constant';
import { PermissionGuard } from '../../authentication/guards/permission.guard';
import { Permissions } from '../../authentication/decorators/permission.decorator';
import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { GetUser } from '../../../common/decorators';
import { PaginationDTO } from '../../../common/dto';

@Controller('roles')
@UseGuards(UserAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.CREATE_ROLE])
  @UseGuards(PermissionGuard)
  async addRole(@Body() payload: CreateRoleDto, @GetUser() user: any) {
    return this.roleService.createRole(payload, user);
  }

  @Get('')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.VIEW_ROLE])
  @UseGuards(PermissionGuard)
  async getRoles(@Query() payload: PaginationDTO, @GetUser() user: any) {
    return this.roleService.getRoles(payload);
  }

  @Get('/permissions')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.VIEW_ROLE])
  @UseGuards(PermissionGuard)
  async getPermissions() {
    return this.roleService.getPermission();
  }

  @Post('/assign')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.ASSIGN_ROLE])
  @UseGuards(PermissionGuard)
  async assignRole(@Body() payload: AssignRoleDTO) {
    return this.roleService.assignRole(payload);
  }

  @Get('/:id')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.VIEW_ROLE])
  @UseGuards(PermissionGuard)
  async getRole(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: any,
  ) {
    return this.roleService.getRole(id);
  }

  @Put('/:id')
  @Permissions([ROLE.PERMISSIONS.ALL, ROLE.PERMISSIONS.UPDATE_ROLE])
  @UseGuards(PermissionGuard)
  async updatedRole(
    @Body() payload: UpdateRoleDTO,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.roleService.updatedRole(id, payload);
  }
}
