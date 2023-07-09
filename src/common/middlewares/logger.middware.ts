import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const http = req.protocol.toUpperCase();
    const reqTime = new Date()
      .toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
      .replace(', ', ' - ');
    const reqMethod = req.method;
    const reqUrl = req.url;
    console.log(`[${http}] - [${reqTime}] [${reqMethod}] ${reqUrl}`);
    next();
  }
}

export const loggerMiddleware = new LoggerMiddleware().use;
