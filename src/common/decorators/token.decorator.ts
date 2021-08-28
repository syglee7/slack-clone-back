import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);

// @Token() token
// 중복제거

// ctx => http, rpc, websocket 에 대한 정보가 다 들어 있기 때문에 하나의 객체로 접근 가능
