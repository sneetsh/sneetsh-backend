import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PaginationMiddleware } from './common/middlewares/pagination.middleware';
import { validate } from './common/validations';

import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import dbConfig from './config/db.config';

import { UserModule } from './modules/user/user.module';
import { RoleManagementModule } from './modules/role-management/role-management.module';
import { DatabaseModule } from './modules/database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { MediaModule } from './modules/media/media.module';
import { MessagesModule } from './modules/messages/messages.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      validate,
      load: [authConfig, cloudinaryConfig, dbConfig],
    }),
    DatabaseModule,
    AuthenticationModule,
    MediaModule,
    MessagesModule,
    UserModule,
    RoleManagementModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }
}
