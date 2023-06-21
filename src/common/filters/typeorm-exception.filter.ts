import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = 500;
    const code = exception['code'];
    let message = exception['message'];

    if (code === '23505') {
      message = `User with email \'${exception['parameters'][0]}\' already exists`;
      statusCode = 400;
    }

    const errors = {
      code,
      message,
    };

    response.status(statusCode).json({
      statusCode,
      success: false,
      errors,
    });
  }
}
