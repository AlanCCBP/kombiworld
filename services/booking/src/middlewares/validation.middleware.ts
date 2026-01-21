import { Request, Response, NextFunction } from 'express';

export function validateBody(_schema: unknown) {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}
