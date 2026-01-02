import { CompanyRole } from '@/prisma/generated/prisma/enums';
import { Request, Response, NextFunction } from 'express';

export function requireCompanyRole(...allowedRoles: CompanyRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const membership = req.membership;

    if (!membership) {
      return res.status(500).json({
        message: 'Company context not initialized',
      });
    }

    if (!allowedRoles.includes(membership.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
      });
    }

    next();
  };
}
