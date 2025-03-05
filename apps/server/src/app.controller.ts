import { Controller, Get } from "@nestjs/common";

@Controller("")
export class AppController {
  @Get()
  getHello(): string {
    return `2테스트 + ${process.env.TEST_ENV} ${process.env.TEST_ENV2} `;
  }
}
