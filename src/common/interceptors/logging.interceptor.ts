import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { ApiService } from '../utils/api/api.service';
import { HttpHeaders, TypeMethod } from 'src/consts';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type_method = context.getType<string>();
    const now = Date.now();
    if (type_method === TypeMethod.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context).getContext();
      const req = ctx.req;
      const requestId = req.headers[HttpHeaders.REQUEST_ID];
      Logger.log({
        message: `Before /graphql`,
        payload: req.body.query.replace(/\s+/g, ' ').trim(),
        requestId,
      });
      return next.handle().pipe(
        tap((value) =>
          Logger.log({
            message: `After /graphql`,
            requestId,
            payload: JSON.stringify(value),
            time: `${Date.now() - now}ms`,
          })
        )
      );
    } else if (type_method === TypeMethod.HTTP) {
      const { getRequest, getResponse } = context.switchToHttp();
      const req = getRequest<Request>();
      const res = getResponse<Response>();

      const requestId = req.headers[HttpHeaders.REQUEST_ID];
      const path = req.path;
      Logger.log({
        message: `Before ${path}`,
        payload: JSON.stringify(this.apiService.getPayload(req)),
        requestId,
      });
      return next.handle().pipe(
        tap((value) =>
          Logger.log({
            message: `After ${path}`,
            requestId,
            payload: JSON.stringify(value),
            time: `${Date.now() - now}ms`,
          })
        )
      );
    }
  }
}
