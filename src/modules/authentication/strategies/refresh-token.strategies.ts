import { Request } from "express";

import {
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

import { getEnv } from "src/common/helpers";
import TOKEN_TYPES from 'src/common/constants/token.constant'
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";
import { Token } from "src/modules/user/entities/token.entity";

const ENV_VARIABLES = getEnv();

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-strategy"
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {
    console.log('')
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.body?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: ENV_VARIABLES.JWT_SECRET,
    });
  }

  async validate(request: any, payload: any) {
    const { id } = payload;

    const token = await this.tokenRepository.findOne({ where: { id } });
    if (!token)
      throw new UnauthorizedException("Invalid refresh token please login");

    const refreshToken = request.body?.refresh_token;
    const savedToken: any = await this.tokenRepository.findOne({
      where: {
        type: TOKEN_TYPES.REFRESH_TOKEN,
        identifier: token.identifier,
        token: refreshToken,
      }
    });

    if (!savedToken)
      throw new UnauthorizedException("Invalid refresh token please login")

    await refreshToken.delete();

    return (request.refresh_token = savedToken);
  }
}
