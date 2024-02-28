import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiService {
  getPayload(req: Request) {
    return { ...req.query, ...req.params, ...req.body };
  }
}
