
import { UserService } from "../services/user.service";
import { UserUpdateDto } from "../dtos";
import { GetUser } from "src/common/decorators";
import { User } from "../entities/user.entity";
import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserAuthGuard } from "src/modules/authentication/guards/user.guard";

@Controller("users")
@UseGuards(UserAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get("")
  async getUser(@GetUser() { id }: User) {
    return this.userService.getUser(id);
  }

  @Put("")
  updateUser(@Body() body: UserUpdateDto, @GetUser() { id }: User) {
    return this.userService.update({ user_id: id, ...body });
  }
}
