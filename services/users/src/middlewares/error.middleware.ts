import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-errors';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    message: 'Internal server error',
  });
}
