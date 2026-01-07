import { Request, Response, NextFunction } from 'express';
import { BadRequestError, ForbiddenError } from '../errors/http-errors';

export function requireCompanyContext(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const companyId = req.header('X-Company-Id');

  if (!companyId) {
    return next(new BadRequestError('X-Company-Id header missing'));
  }

  if (!req.auth?.activeCompany) {
    return next(new ForbiddenError('No access to this company'));
  }

  next();
}
