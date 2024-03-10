import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiService } from '../utils/api/api.service';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TypeMethod } from 'src/consts';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  constructor(private apiService: ApiService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type_method = context.getType<string>();
    if (type_method === TypeMethod.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context).getContext();
      const req = ctx.req;
      return next.handle();
    } else if (type_method === TypeMethod.HTTP) {
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
}
