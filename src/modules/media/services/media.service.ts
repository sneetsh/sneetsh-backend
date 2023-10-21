import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Media } from '../entities/media.entity';
import { PaginationDTO } from 'src/common/dto';
import { AddSongDTO } from '../dtos';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly songRepository: Repository<Media>,
  ) { }


  async addSong(payload: AddSongDTO) {

  }

  async getSingleSong(id: string) {

  }

  async getMedia(pagination: PaginationDTO) {

  }

  async getTrending(pagination: PaginationDTO) {

  }

  async getUserMedia(id: string) {

  }
}
