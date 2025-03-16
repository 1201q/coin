import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { ConfigService } from "@nestjs/config";
import { AppLogger } from "src/logger.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {}

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  async login(@Req() req: Request) {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as GoogleUser;
    const findUser = await this.userService.findUserByGoogleId(user.user_id);

    if (!findUser) {
      // 유저가 새로운 유저인 경우
      await this.userService.createGoogleUser({
        name: user.name,
        email: user.email,
        user_id: user.user_id,
        provider: "google",
      });
    }

    // 새로운 토큰 생성
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.user_id,
    );

    // db에 refreshToken 저장
    await this.userService.updateRefreshToken(user.user_id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const url =
      this.configService.get<string>("NODE_ENV") === "production"
        ? `https://coingosu.live`
        : `http://localhost:3000`;

    return res.redirect(url);
  }

  @Get("check-cookie")
  async checkCookie(@Req() req: Request) {
    console.log("쿠키 확인", req.cookies);
    return { refreshToken: req.cookies["refreshToken"] || "없음" };
  }

  @Post("refresh")
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      throw new UnauthorizedException("로그인이 필요합니다.");
    }

    const newTokens = await this.authService.refreshAccessToken(refreshToken);

    res.cookie("accessToken", newTokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", newTokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ accessToken: newTokens.accessToken });
  }

  @Post("logout")
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies["refreshToken"];

    this.logger.log(`1refreshToken: ${refreshToken}`);

    if (refreshToken) {
      await this.userService.removeRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: this.configService.get<string>("NODE_ENV") === "production",
      sameSite: "strict",
      domain:
        this.configService.get<string>("NODE_ENV") === "production"
          ? ".coingosu.live"
          : undefined,
      path: "/",
    });

    return res.json({ message: "로그아웃 성공" });
  }
}
