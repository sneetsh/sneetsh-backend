import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import dbConfig from '../config/db.config';
import { DatabaseModule } from '../modules/database/database.module';
import { Permission } from '../modules/role-management/entities/permission.entity';
import { Role } from '../modules/role-management/entities/role.entity';
import { User } from '../modules/user/entities/user.entity';

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
  // DefaultPermissionSeeder,
  // DefaultRoleSeeder,
  // DefaultUserSeeder,
]);
