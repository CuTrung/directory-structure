import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiService } from '../utils/api/api.service';
import { Request, Response } from 'express';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { getRequest, getResponse } = context.switchToHttp();
    const req = getRequest<Request>();
    const res = getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        return this.apiService.formatResponse({
          status_code: res.statusCode,
          path: req.path,
          data,
        });
      })
    );
  }
}
