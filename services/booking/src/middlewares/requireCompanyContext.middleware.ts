import { Request, Response, NextFunction } from 'express';

export function requireCompanyContext(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const companyId = req.headers['x-company-id'];

  if (!companyId || typeof companyId !== 'string') {
    return res.status(400).json({ message: 'Company context is required' });
  }

  req.companyId = companyId;
  next();
}
