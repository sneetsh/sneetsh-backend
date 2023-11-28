import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';

import { Repository } from 'typeorm';

import users from './data';
import { User } from '../entities/user.entity';
import { connectionSource } from '../../../typeorm.config';
import { hash } from '../../../common/utils';

@Injectable()
export class DefaultUserSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<any> {
    const queryRunner = connectionSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      for (const user of users) {
        const { ...userData } = user;

        const _user = await queryRunner.manager.findOneBy(User, {
          id: userData.id,
        });
        if (_user) {
          userData.password = await hash(userData.password);
          Object.assign(_user, userData);
          await queryRunner.manager.save(User, _user);

          continue;
        }

        const newUser = queryRunner.manager.create(User, userData);
        await queryRunner.manager.save(User, newUser);
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
    await this.userRepository.delete(users.map((user) => user.id));
  }
}
