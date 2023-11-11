import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { MediaService } from "../services/media.service";
import { AddSongDTO } from "../dtos";
import { PaginationDTO } from "src/common/dto";
import { GetUser } from "src/common/decorators";
import { User } from "src/modules/user/entities/user.entity";
import { UserAuthGuard } from "src/modules/authentication/guards/user.guard";

@Controller("media")
@UseGuards(UserAuthGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
  ) { }

  @Post('')
  async addSong(@Body() payload: AddSongDTO, @GetUser() user: User) {
    return this.mediaService.addMedia(payload, user);
  }

  @Get('/:media_id')
  async getSong(@Param('media_id', new ParseUUIDPipe()) mediaId: string) {
    return this.mediaService.getSingleSong(mediaId);
  }

  @Get('/trending')
  async getTrending(pagination: PaginationDTO) {
    return this.mediaService.getTrending(pagination);
  }

  @Get('/:user_id')
  async getUserMedia(@Param('user_id', new ParseUUIDPipe()) userId: string) {
    return this.mediaService.getUserMedia(userId);
  }

  @Get('')
  async getMedia(pagination: PaginationDTO) {
    return this.mediaService.getMedia(pagination);
  }
}
