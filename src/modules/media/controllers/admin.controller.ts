import { Controller, UseGuards } from '@nestjs/common';

import { UserAuthGuard } from '../../authentication/guards/user.guard';
import { MediaService } from '../services/media.service';

@Controller('admin')
@UseGuards(UserAuthGuard)
export class AdminController {
  constructor(private readonly mediaService: MediaService) {}
}
