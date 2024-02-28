import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiService } from '../utils/api/api.service';
import { HttpHeaders } from 'src/consts';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private apiService: ApiService;
  constructor() {
    if (!this.apiService) {
      this.apiService = new ApiService();
    }
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getRequest<Response>();
    const now = Date.now();
    const requestId = req.headers[HttpHeaders.REQUEST_ID];
    const path = req.path;
    Logger.log({
      message: `Before ${path}`,
      payload: JSON.stringify(this.apiService.getPayload(req)),
      requestId,
    });
    return next.handle().pipe(
      tap((value) => {
        return Logger.log({
          message: `After ${path}`,
          requestId,
          payload: JSON.stringify(value),
          time: `${Date.now() - now}ms`,
        });
      })
    );
  }
}
