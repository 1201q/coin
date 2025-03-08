import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GoogleAuthGuard } from "../guard/google-auth.guard";
import { Request, Response } from "express";
import { GoogleUser } from "src/types/entities/user.entity";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async login(@Req() req: Request) {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as GoogleUser;
    const findUser = await this.userService.findUserByGoogleId(user.userId);

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.userId,
    );

    if (!findUser) {
      console.log("user not found");

      await this.userService.createGoogleUser({
        name: user.name,
        email: user.email,
        user_id: user.userId,
        type: "google",
      });

      await this.userService.updateRefreshToken(user.userId, refreshToken);
    } else {
      await this.userService.updateRefreshToken(user.userId, refreshToken);
    }

    return res.redirect(
      `http://localhost:5500/nestjs/login.html?token=${accessToken}`,
    );
  }
}
