import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cloudinary from 'cloudinary';
import { removeUnusedImage } from 'src/common/utils';

@Injectable()
export class Cloudinary {
  logger: Logger;
  cloud: typeof cloudinary.v2 = cloudinary.v2;

  constructor(private readonly configService: ConfigService) {
    this.cloud.config(this.configService.get('cloudinary'));
    this.logger = new Logger('UPLOAD_SERVICE');
  }

  async uploadFile(filePath: string, options: any = {}) {
    try {
      const result = await this.cloud.uploader.upload(filePath, {
        folder: 'sneetsh',
        overwrite: true,
        ...options,
      });

      return result;
    } catch (error) {
      this.logger.error(error, error?.stack);
      throw new BadRequestException(error);
    } finally {
      removeUnusedImage(filePath);
    }
  }
}
