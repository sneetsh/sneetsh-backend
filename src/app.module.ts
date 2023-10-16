import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from './common/validations';

import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import dbConfig from './config/db.config';

import { UserModule } from './modules/user/user.module';
import { RoleManagementModule } from './modules/role-management/role-management.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    ignoreEnvFile: false,
    validate,
      load: [authConfig, cloudinaryConfig, dbConfig]
    }),
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    RoleManagementModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }