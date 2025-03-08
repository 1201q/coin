import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      throw new UnauthorizedException(`인증 실패: ${err.message}`);
    }

    if (!user) {
      if (info?.message === "No auth token") {
        throw new UnauthorizedException("액세스 토큰이 필요합니다.");
      }
      if (info?.message === "jwt expired") {
        throw new UnauthorizedException("토큰이 만료되었습니다.");
      }
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    return user;
  }
}
