import { Controller, Get } from "@nestjs/common";

@Controller("")
export class AppController {
  @Get()
  getHello(): string {
    return `1테스트 + ${process.env.TEST_ENV} `;
  }
}
