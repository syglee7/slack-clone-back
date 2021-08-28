import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// 실무에서는 nest-morgan 적용하는게 나음
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      // Logger.log
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
