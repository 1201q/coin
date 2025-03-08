import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { UserService } from "./user.service";
import { TestUser, User } from "../types/entities/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get()
  async getAllusers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
