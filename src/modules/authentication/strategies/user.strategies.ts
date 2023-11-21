import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../user/entities/user.entity';

import { Repository } from 'typeorm';
import { getEnv } from '../../../common/helpers';

const ENV_VARIABLES = getEnv();

@Injectable()
export class JwtUserStrategy extends PassportStrategy(
  Strategy,
  'jwt-user-strategy',
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: ENV_VARIABLES.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    const { password, email } = payload;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.permissions', 'permissions')
      .addSelect(['user.password', 'user.locked'])
      .getOne();

    if (!user || password !== user?.password) {
      throw new UnauthorizedException('Access invalid, please login');
    }

    if (user.locked)
      throw new ForbiddenException(
        'User account blocked, please contact admin',
      );

    if (!user.activated)
      throw new ForbiddenException('User account not activated');

    user.password = undefined;

    return user;
  }
}
