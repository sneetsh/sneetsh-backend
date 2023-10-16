import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserNotLockedGuard extends AuthGuard("jwt-user-strategy") {
  handleRequest(err: any, user, info: any) {
    if (err || !user || user.locked) {
      throw (
        err ||
        new UnauthorizedException({
          status: "error",
          message: "Unauthorized user",
        })
      );
    }

    return user;
  }
}
