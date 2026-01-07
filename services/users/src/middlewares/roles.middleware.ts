import { GlobalRole } from '@/prisma/generated/prisma/enums';
import { Request, NextFunction } from 'express';

export function requireGlobalRole(...roles: GlobalRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userRoles = req.auth?.globalRoles ?? [];

    if (!roles.some((r) => userRoles.includes(r))) {
      return next(new Error('Forbidden'));
    }

    next();
  };
}
