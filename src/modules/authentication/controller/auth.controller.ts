import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
    AccessTokenRefreshDTO,
    ActivateDTO,
    PasswordResetDTO,
    PasswordRestEmailRequestDTO,
    UserLoginDto,
    UserSignupDto,
    resendActivationTokenDTO
} from "../dtos";
import { AuthService } from "../service/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() body: UserSignupDto) {
        return this.authService.signup(body);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() body: UserLoginDto) {
        return this.authService.login(body);
    }

    @Post("/activate")
    @HttpCode(HttpStatus.OK)
    async activate(@Body() payload: ActivateDTO) {
        return this.authService.activate(payload);
    }

    @Post("/resend-activate")
    async resendActivate(@Body() payload: resendActivationTokenDTO) {
        return this.authService.resendToken(payload);
    }

    @Post("/refresh-token")
    async refreshToken(@Body() payload: AccessTokenRefreshDTO) {
        return this.authService.accessTokenRefresh(payload);
    }

    @Post("/password-reset-request")
    async passwordReset(@Body() body: PasswordRestEmailRequestDTO) {
        return this.authService.passwordRestRequest(body);
    }

    @Post("/password-reset")
    async passwordRestEmail(@Body() payload: PasswordResetDTO) {
        return this.authService.passwordReset(payload);
    }
}
