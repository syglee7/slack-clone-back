import { Injectable } from '@nestjs/common';

// 요청, 응답에 대해서는 알지 못한다.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
