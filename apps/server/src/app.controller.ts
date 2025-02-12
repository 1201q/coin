import { Controller, Get } from "@nestjs/common";

@Controller("")
export class AppController {
  @Get()
  getHello(): string {
    return "멀티 스테이지 빌드";
  }
}
