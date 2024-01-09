import { Request, Response, NextFunction } from 'express';

export function mergedBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.body = { ...req.body, ...req.params, ...req.query };
  next();
}
