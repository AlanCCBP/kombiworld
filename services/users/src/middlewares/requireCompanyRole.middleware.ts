import { CompanyRole } from '@/prisma/generated/prisma/enums';
import { Request, Response, NextFunction } from 'express';

export function requireCompanyRole(...allowedRoles: CompanyRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const activeCompany = req.auth?.activeCompany;

    if (!activeCompany) {
      return next(new Error('Company context not initialized'));
    }

    if (!allowedRoles.includes(activeCompany.role)) {
      return next(new Error('Insufficient permissions'));
    }

    next();
  };
}
