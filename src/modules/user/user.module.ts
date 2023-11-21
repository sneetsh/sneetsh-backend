import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AdminController } from './controllers/admin.controller';

import { AuthService } from '../authentication/service/auth.service';

import { Role } from '../role-management/entities/role.entity';
import { Permission } from '../role-management/entities/permission.entity';
import { Token } from './entities/token.entity';
import { UserController } from './controllers/user.controller';
import { EmailService } from '../../common/services/email.service';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get('auth.jwt'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role, Permission, User, Token]),
  ],
  exports: [],
  controllers: [AdminController, UserController],
  providers: [AuthService, UserService, EmailService],
})
export class UserModule {}
