import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class TokenRefreshAuthGuard extends AuthGuard("jwt-refresh-strategy") {
    handleRequest(err: any, token: any, info: any) {
        if (err || !token) {
            throw (
                err || new UnauthorizedException("Refresh token invalid please login")
            );
        }

        return token;
    }
}
