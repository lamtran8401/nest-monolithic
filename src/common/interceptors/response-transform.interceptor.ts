import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const http = context.switchToHttp();
    const response: Response = http.getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map(data => {
        return {
          statusCode,
          success: true,
          data,
        };
      }),
    );
  }
}
