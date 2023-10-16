import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RoleController } from "./controllers/role.controller";
import { RoleService } from "./services/role.service"
import { Role } from "./entities/role.entity";
import { Permission } from "./entities/permission.entity";
import { User } from "../user/entities/user.entity";
import { PermissionGuard } from "../authentication/guards/permission.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  controllers: [RoleController],
  providers: [RoleService, PermissionGuard],
  exports: [TypeOrmModule]
})
export class RoleManagementModule { }
