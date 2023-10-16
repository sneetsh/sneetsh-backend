import { GetUser } from "src/common/decorators";
import { User } from "../entities/user.entity";
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseGuards } from "@nestjs/common";
import { UserAuthGuard } from "src/modules/authentication/guards/user.guard";
import { Permissions } from "src/modules/authentication/decorators/permission.decorator";
import { USER } from "src/common/constants";
import { PermissionGuard } from "src/modules/authentication/guards/permission.guard";
import { UserSignupDto } from "src/modules/authentication/dtos";
import { AuthService } from "src/modules/authentication/service/auth.service";

@Controller("staffs")
@UseGuards(UserAuthGuard)
export class StaffController {
  constructor(private readonly authService: AuthService
  ) { }
}
