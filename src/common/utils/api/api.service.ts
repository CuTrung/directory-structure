import { HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ApiResponse } from './api.entity';

@Injectable()
export class ApiService {
  getPayload(req: Request) {
    return { ...req.query, ...req.params, ...req.body };
  }

  formatResponse({
    status_code = HttpStatus.OK,
    timestamp = new Date().toISOString(),
    path,
    errors = null,
    data = null,
  }: ApiResponse) {
    return {
      status_code,
      timestamp,
      path,
      errors,
      data,
    };
  }
}
