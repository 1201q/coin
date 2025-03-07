import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async generateTokens(userId: string) {
    const payload = { id: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: "20s",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      });

      console.log(decoded);
      const user = await this.userService.findUserByGoogleId(decoded.id);

      if (!user || user.refresh_token !== refreshToken) {
        throw new BadRequestException("Invalid refresh token");
      }

      const newToken = await this.generateTokens(user.user_id);

      return { accessToken: newToken.accessToken };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
