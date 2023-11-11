import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Media } from '../entities/media.entity';
import { PaginationDTO } from 'src/common/dto';
import { AddSongDTO } from '../dtos';
import { User } from 'src/modules/user/entities/user.entity';
import { isEmail, isUUID } from 'class-validator';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async addMedia(payload: AddSongDTO, user: User) {
    const { features, ...newSongPayload } = payload;

    let feature_refs = [];
    let feats = [];
    const media = this.mediaRepository.create(newSongPayload);

    for (let feature of features) {
      if (isUUID(feature)) {
        const artist = await this.userRepository.findOneBy({ id: feature });
        feats.push(artist);
        feature_refs.push(artist.username);
      } else if (isEmail(feature)) {
        const artist = await this.userRepository.findOneBy({ id: feature });
        feats.push(artist);
        feature_refs.push(artist.username);
      } else {
        feature_refs.push(feature);
      }
    }

    media.feature_refs = feature_refs;
    media.features = feats;

    media.user = user;

    return media.save();
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
