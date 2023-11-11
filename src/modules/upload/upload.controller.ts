import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import fileFilterOptions from './helpers/filesInterceptor';
import { UploadService } from './providers/upload.service';
import { SuccessResponse } from 'src/common/helpers';
import { Base64FilesDTO } from './validators';

@Controller('upload')
export class UploadsController {
  constructor(private uploadService: UploadService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10, fileFilterOptions))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    const fileLinks = await this.uploadService.handleMultipleUploads(files);

    return new SuccessResponse('File(s) uploaded successfully', fileLinks);
  }

  @Post('/base64')
  async uploadBase64(
    @Body() payload: Base64FilesDTO,
  ): Promise<any> {
    const fileLinks = await this.uploadService.handleMultipleBase64Uploads(
      payload,
    );

    return new SuccessResponse('File(s) uploaded successfully', fileLinks);
  }
}
