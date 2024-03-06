import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpHeaders } from 'src/consts';
import { ApiService } from '../utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private apiService: ApiService
  ) {}
  getMessagesError(errors) {
    if (typeof errors === 'string') return [errors];
    return Array.isArray(errors.message) ? errors.message : [errors.message];
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    const { httpAdapter } = this.httpAdapterHost;

    const exceptionInstance =
      exception instanceof HttpException
        ? {
            status: exception?.getStatus(),
            exception: exception.getResponse(),
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            exception: exception.message,
          };

    const errors = this.getMessagesError(exceptionInstance.exception);
    Logger.error({
      message: JSON.stringify(errors),
      requestId: request.headers[HttpHeaders.REQUEST_ID],
      payload: JSON.stringify(this.apiService.getPayload(request)),
    });

    httpAdapter.reply(
      response,
      {
        statusCode: exceptionInstance.status,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
        errors,
      },
      exceptionInstance.status
    );
  }
}
