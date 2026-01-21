import { requestContext } from '../utils/requestContext';
import { Request, Response, NextFunction } from 'express';

export function contextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization || '';

  requestContext.run({ token }, () => {
    next();
  });
}
