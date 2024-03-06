import { Request, Response, NextFunction } from 'express';
import { StringService } from '../utils/string/string.service';
import { ConfigService } from '@nestjs/config';
import { HttpHeaders } from 'src/consts';
import { IncomingHttpHeaders } from 'http2';

const _setHeaders = (headers: IncomingHttpHeaders) => {
  const stringService = new StringService();
  const configService = new ConfigService();
  const instance = {
    [HttpHeaders.REQUEST_ID]:
      headers[HttpHeaders.REQUEST_ID] ?? stringService.genRandom(),
    [HttpHeaders.VERSION]:
      headers[HttpHeaders.VERSION] ?? configService.get('API_VERSION'),
  };
  for (const [key, value] of Object.entries(instance)) {
    headers[key] = value;
  }
};
export const DefaultParamsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  _setHeaders(req.headers);
  next();
};
