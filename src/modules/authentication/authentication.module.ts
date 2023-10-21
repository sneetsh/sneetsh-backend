import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./controller/auth.controller";
import { JwtUserStrategy } from "./strategies/user.strategies";
import { JwtRefreshStrategy } from "./strategies/refresh-token.strategies";

import { AuthService } from "./service/auth.service";
import { User } from "../user/entities/user.entity";
import { Token } from "../user/entities/token.entity";
import { EmailService } from "src/common/services/email.service";
import { Role } from "../role-management/entities/role.entity";

@Global()
@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => config.get("auth.jwt"),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Token, User, Role])
  ],
  providers: [JwtUserStrategy, JwtRefreshStrategy, AuthService, EmailService],
  exports: [JwtModule, AuthService],
  controllers: [AuthController],
})

export class AuthenticationModule { }
