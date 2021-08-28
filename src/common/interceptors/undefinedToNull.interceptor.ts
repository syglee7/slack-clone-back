import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
    // 마지막 데이터를 한번 더 가공
  }
}

// ({ data, code: 'SUCCESS' })
// data === user
// { data: user, code: 'SUCCESS' }

// A -> B -> C -> D

// A -> C -> D

// A -> E -> F -> D -> G

// Z -> A -> X -> D

// 컨트롤러 실행 전 후에 특정 동작을 추가 해 줄 수 있다.
// 미들웨어는 전/후 하나만 관리 할 수 있었는데 인터셉터는 두개를 동시에 관장
