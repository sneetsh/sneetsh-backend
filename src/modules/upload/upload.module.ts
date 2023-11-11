import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MulterModule } from '@nestjs/platform-express';

import { Cloudinary } from './providers/cloudinary.service';
import { UploadsController } from './upload.controller';
import { UploadService } from './providers/upload.service';
import cloudinaryConfig from '../../common/configs/cloudinary.config';

@Module({
  imports: [
    MulterModule.register(),
    ConfigModule.forRoot({
      load: [cloudinaryConfig],
      ignoreEnvFile: false,
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadService, Cloudinary],
  exports: [UploadService]
})
export class UploadModule { }
