import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpHeaders, TypeMethod } from 'src/consts';
import { ApiService } from '../utils/api/api.service';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

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
    const type_method = host.getType<string>();
    if (type_method === TypeMethod.GRAPHQL) {
      const ctx = GqlExecutionContext.create(
        host as ExecutionContext
      ).getContext();
      const req = ctx.req;
      const res = ctx.res;
    } else if (type_method === TypeMethod.HTTP) {
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
}
