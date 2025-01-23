import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  getHello(): string {
    return '백엔드에서 도커의 변경 감지1';
  }
}
