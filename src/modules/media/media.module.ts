import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { Role } from '../role-management/entities/role.entity';
import { Permission } from '../role-management/entities/permission.entity';
import { AdminController } from './controllers/admin.controller';
import { User } from '../user/entities/user.entity';
import { Media } from './entities/media.entity';
import { MediaController } from './controllers/media.controller';
import { Token } from '../user/entities/token.entity';
import { MediaService } from './services/media.service';
import { UserService } from '../user/services/user.service';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get('auth.jwt'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role, Permission, User, Media, Token]),
  ],
  exports: [UserService],
  controllers: [MediaController, AdminController],
  providers: [UserService, MediaService],
})
export class MediaModule {}
