import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { UserService } from "./user.service";
import { User } from "../types/entities/user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException("인증되지 않은 사용자");
    }

    console.log(req.user);

    return { ...req.user, expiresIn: req.user.expiresIn };
  }

  @Get()
  async getAllusers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
