import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { seeder } from "nestjs-seeder";

import { DatabaseModule } from "src/modules/database/database.module";

import dbConfig from "src/common/configs/db.config";

import { DefaultPermissionSeeder } from 'src/modules/role-management/seeders/permissions/default-permissions.seeder'
import { DefaultRoleSeeder } from 'src/modules/role-management/seeders/role/default-role.seeder'
import { DefaultUserSeeder } from "src/modules/user/seeders/default-user.seeder";

import { Permission } from "src/modules/role-management/entities/permission.entity";
import { Role } from "src/modules/role-management/entities/role.entity";
import { User } from "src/modules/user/entities/user.entity";

seeder({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig],
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Permission, Role, User]),
  ],
}).run([
  DefaultPermissionSeeder,
  DefaultRoleSeeder,
  DefaultUserSeeder,
]);
