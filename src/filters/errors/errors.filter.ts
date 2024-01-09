import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { getCurrentDate } from 'src/utils';

@Catch(HttpException)
export class ErrorsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).json({
      statusCode: status,
      data: null,
      errors: this.convertErrorsMessage(exception),
      timestamp: getCurrentDate(),
    });
  }

  convertErrorsMessage(exception: HttpException) {
    const resException = exception.getResponse();
    return typeof resException === 'string'
      ? [resException]
      : (resException as { message: string[] })?.message;
  }
}
