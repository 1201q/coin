import { Controller, Get } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Controller("")
export class AppController {
  @Get()
  getHello(): string {
    return `${uuidv4()}테스트 `;
  }
}
