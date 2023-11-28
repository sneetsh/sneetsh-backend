import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

import mediaContents from './data';
import { connectionSource } from '../../../typeorm.config';
import { Media } from '../entities/media.entity';
import { hash } from '../../../common/utils';

@Injectable()
export class DefaultMediaSeeder implements Seeder {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async seed(): Promise<any> {
    const queryRunner = connectionSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      for (const media of mediaContents) {
        const { ...userData } = media;

        const _user = await queryRunner.manager.findOneBy(Media, {
          id: userData.id,
        });
        if (_user) {
          userData.password = await hash(userData.password);
          Object.assign(_user, userData);
          await queryRunner.manager.save(Media, _user);

          continue;
        }

        const newUser = queryRunner.manager.create(Media, userData);
        await queryRunner.manager.save(Media, newUser);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error?.message, error?.status);
    } finally {
      await queryRunner.release();
    }
  }

  async drop(): Promise<any> {
    await this.mediaRepository.delete(mediaContents.map((song) => song.id));
  }
}
