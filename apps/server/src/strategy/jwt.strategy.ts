import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserByGoogleId(payload.id);

    if (!user) {
      throw new UnauthorizedException("사용자가 존재하지 않습니다.");
    }

    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초)
    const expiresIn = payload.exp - currentTime; // 남은 시간 (초)

    return {
      id: user.user_id,
      email: user.email,
      name: user.name,
      wallet_id: user.wallet.wallet_id,
      expiresIn,
    };
  }
}
