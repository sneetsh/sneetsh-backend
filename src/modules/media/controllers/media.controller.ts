import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from "@nestjs/common";
import { MediaService } from "../services/media.service";
import { AddSongDTO } from "../dtos";
import { PaginationDTO } from "src/common/dto";
import { GetUser } from "src/common/decorators";
import { User } from "src/modules/user/entities/user.entity";
import { UserAuthGuard } from "src/modules/authentication/guards/user.guard";

@Controller("media")
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
  ) { }

  @Post('')
  @UseGuards(UserAuthGuard)
  async addSong(@Body() payload: AddSongDTO, @GetUser() user: User) {
    return this.mediaService.addMedia(payload, user);
  }

  @Get('/:media_id')
  async getSingleMedia(@Param('media_id', new ParseUUIDPipe()) mediaId: string) {
    return this.mediaService.getSingleMedia(mediaId);
  }

  @Get('/trending')
  async getTrending(pagination: PaginationDTO) {
    return this.mediaService.getTrending(pagination);
  }

  @Get('user/:user_id')
  async getUserMedia(@Param('user_id', new ParseUUIDPipe()) userId: string, @Query() pagination: PaginationDTO) {
    return this.mediaService.getUserMedia(userId, pagination);
  }

  @Get('')
  async getMedia(@Query() pagination: PaginationDTO, @GetUser() user: any) {
    return this.mediaService.getMedia(pagination, user);
  }
}
