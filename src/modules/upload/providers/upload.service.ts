import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from "@nestjs/common";

import { Cloudinary } from './cloudinary.service';
import { Base64FilesDTO } from "../validators";
import { IMAGE_FORMATS, SOUND_FORMATS } from "../helpers/interface";
import { getFileData } from "src/common/utils";

@Injectable()
export class UploadService {
  constructor(private cloud: Cloudinary) { }

  async handleMultipleUploads(files: Express.Multer.File[]) {
    const fileLinks: string[] = [];

    if (!files.length) {
      throw new NotAcceptableException('At least one file must be uploaded');
    }

    for await (const file of files) {

      const { ext, filename } = getFileData(file);

      const isSound = Object.values(SOUND_FORMATS).includes((ext as any));
      const folder = isSound ? 'sneetsh/media' : 'sneetsh/image'
      const resource_type = isSound ? 'auto' : 'image'

      const data = await this.cloud.uploadFile(file.path, { public_id: filename, folder, resource_type });

      fileLinks.push(data.url);
    }

    const successfulUploads = fileLinks.filter(Boolean);
    return successfulUploads;
  }

  async handleMultipleBase64Uploads({ files }: Base64FilesDTO) {
    const fileLinks: string[] = [];

    if (!files.length) {
      throw new NotAcceptableException('At least one file must be uploaded');
    }

    for (const file of files) {
      const data = await this.cloud.uploadFile(file as any);

      fileLinks.push(data.url);
    }

    if (files.length !== fileLinks.length) {
      throw new BadRequestException('Unable to upload some file');
    }

    const successfulUploads = fileLinks.filter(Boolean);
    return successfulUploads;
  }
}
