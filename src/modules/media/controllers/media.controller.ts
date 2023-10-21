import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from "@nestjs/common";
import { MediaService } from "../services/media.service";
import { AddSongDTO } from "../dtos";
import { PaginationDTO } from "src/common/dto";

@Controller("media")
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
  ) { }

  @Post('')
  async addSong(payload: AddSongDTO) {
    return this.mediaService.addSong(payload);
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
