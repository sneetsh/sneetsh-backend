import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RefreshToken = createParamDecorator(
    (data, req: ExecutionContext) => {
        return req.switchToHttp().getRequest().refresh_token;
    }
);