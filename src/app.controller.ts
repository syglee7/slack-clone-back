import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// 요청, 응답에 대해서 알고 있음
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
