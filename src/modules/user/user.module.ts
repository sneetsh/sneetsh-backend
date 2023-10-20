import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { UserController } from 'src/modules/user/controllers/user.controller';
import { AdminUserController } from './controllers/admin.controller';

import { UserService } from 'src/modules/user/services/user.service';
import { AuthService } from '../authentication/service/auth.service';

import { Role } from '../role-management/entities/role.entity';
import { Permission } from '../role-management/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Token } from './entities/token.entity';
import { EmailService } from 'src/common/services/email.service';
import { StaffController } from './controllers/staff.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        HttpModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => config.get("auth.jwt"),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Role, Permission, User, Token]),
    ],
    exports: [UserService],
    controllers: [UserController, AdminUserController, StaffController],
    providers: [AuthService, UserService, EmailService],
})

export class UserModule { }
