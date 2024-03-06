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
import { HttpHeaders } from 'src/consts';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    const now = Date.now();
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
