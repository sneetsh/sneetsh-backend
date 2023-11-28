import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Media } from '../entities/media.entity';
import { AddSongDTO } from '../dtos';
import { User } from '../../user/entities/user.entity';
import { isEmail, isUUID } from 'class-validator';
import { PaginationDTO } from '../../../common/dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addMedia(payload: AddSongDTO, user: User) {
    const { features, ...newSongPayload } = payload;

    const feature_refs = [];
    const feats = [];
    const media = this.mediaRepository.create(newSongPayload);

    for (const feature of features) {
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

  async getSingleMedia(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });
    if (!media)
      throw new NotFoundException('Specified media content not found');

    return media;
  }

  async getMedia(pagination: PaginationDTO, user: User) {
    const { page = 0, limit = 100, search } = pagination;
    console.log('SEARCH: ', search);

    const query = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.user_id =:userId', { userId: user.id })
      .limit(+limit)
      .skip(+page)
      .orderBy({ created_at: 'DESC' });

    if (search)
      query.andWhere(
        '(media.title ILIKE :search OR media.label ILIKE :search OR media.album ILIKE :search OR media.description ILIKE :search)',
        { search: `%${search}%` },
      );

    const [results, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      results,
    };
  }

  async getUserMedia(userId: string, pagination: PaginationDTO) {
    const { page = 0, limit = 100, search } = pagination;

    const query = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.user_id =:userId', { userId })
      .limit(+limit)
      .skip(+page)
      .orderBy({ created_at: 'DESC' });

    if (search)
      query.andWhere(
        '(media.title ILIKE :search OR media.label ILIKE :search OR media.album ILIKE :search OR media.description ILIKE :search)',
        { search: `%${search}%` },
      );

    const [results, total] = await query.getManyAndCount();

    return {
      total,
      page,
      limit,
      results,
    };
  }

  async getTrending(pagination: PaginationDTO) {}
}
