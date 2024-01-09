import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CheckPermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('>>> check permission');
    const decoded = false;
    if (decoded) return next(new UnauthorizedException());

    req.body.user = {};
    next();
  }
}
