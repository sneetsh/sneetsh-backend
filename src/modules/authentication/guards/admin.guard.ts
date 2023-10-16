import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AdminAuthGuard extends AuthGuard("jwt-admin-strategy") {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException("User unauthorized, user not an admin")
      );
    }
    return user;
  }
}
