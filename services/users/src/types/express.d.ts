import { User } from '../modules/users/users.types';
import { CompanyRole } from '@prisma/client';
declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      user?: {
        id: string;
        email?: string;
        firstName?: string;
        lastName?: string;
      };
      company?: {
        id: string;
        role: CompanyRole;
      };
      membership?: CompanyUser;
      body: {
        email?: string;
        role?: CompanyRole;
        token?: string;
        companyId?: string;
      };
    }
  }
}

export {};
