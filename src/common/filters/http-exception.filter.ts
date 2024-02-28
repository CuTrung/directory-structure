import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpHeaders } from 'src/consts';
import { ApiService } from '../utils/api/api.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private apiService: ApiService;
  constructor() {
    if (!this.apiService) {
      this.apiService = new ApiService();
    }
  }
  getMessagesError(errors) {
    if (typeof errors === 'string') return [errors];
    return Array.isArray(errors.message) ? errors.message : [errors.message];
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errors = this.getMessagesError(exception.getResponse());
    Logger.error({
      message: JSON.stringify(errors),
      requestId: request.headers[HttpHeaders.REQUEST_ID],
      payload: JSON.stringify(this.apiService.getPayload(request)),
    });
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors,
    });
  }
}
