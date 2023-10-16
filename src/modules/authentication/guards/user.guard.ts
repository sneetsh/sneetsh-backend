import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserAuthGuard extends AuthGuard("jwt-user-strategy") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
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
