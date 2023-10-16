import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { getEnv } from "src/common/helpers";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/entities/user.entity";
import { Repository } from "typeorm";

const ENV_VARIABLES = getEnv();

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(
  Strategy,
  "jwt-admin-strategy"
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENV_VARIABLES.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { email, password } = payload;

    const admin = await this.userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .leftJoinAndSelect("user.roles", "roles")
      .addSelect(["user.password"])
      .getOne();

    const roles = admin?.roles;
    // const isAdmin = !!roles.filter(role => role.name?.toLowerCase().includes('admin'))?.length;

    if (!admin || password !== admin?.password) {
      throw new UnauthorizedException(
        "Invalid admin access, please login as an admin"
      );
    }

    if (admin.locked)
      throw new ForbiddenException(
        "User account blocked, please contact admin"
      );

    if (!admin.activated)
      throw new ForbiddenException("User account not activated");

    return admin;
  }
}
