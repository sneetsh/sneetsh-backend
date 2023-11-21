import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { UserUpdateDto } from '../dtos';

import { User } from '../entities/user.entity';
import { PaginationDTO } from '../../../common/dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(userId: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id =:userId', { userId })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.school', 'school')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .getOne();

    return user;
  }

  async update(payload: UserUpdateDto) {}

  async getUsers(pagination: PaginationDTO) {
    const { page = 0, limit = 100, search } = pagination;

    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.school', 'school')
      .leftJoinAndSelect('roles.permissions', 'permissions');

    if (search) {
      query.andWhere(
        `
      (user.email ILIKE :search OR user.phone ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search OR school.name ILIKE :search )
      `,
        { search: `%${search}%` },
      );
    }

    const [result, total] = await query
      .take(+limit)
      .skip(+page)
      .getManyAndCount();

    return {
      page,
      limit,
      total,
      result,
    };
  }

  async getDeleteUsers(pagination: PaginationDTO) {
    const { limit = 100, page = 0, search } = pagination;

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.deleted_at IS NOT NULL')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('user.school', 'school')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .withDeleted();

    if (search) {
      query.andWhere(
        `
      (user.email ILIKE :search OR user.phone ILIKE :search OR user.first_name ILIKE :search OR user.last_name ILIKE :search OR school.name ILIKE :search )
      `,
        { search: `%${search}%` },
      );
    }

    const [result, total] = await query
      .take(+limit)
      .skip(+page)
      .getManyAndCount();

    return { limit, page, total, result };
  }

  async deleteUser(user_id: string, user: User) {
    const _user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id =:user_id', { user_id })
      .getOne();

    _user?.softRemove();
  }

  async bulkInsert(users: Partial<User>[]) {
    return await this.userRepository.insert(users);
  }
}
