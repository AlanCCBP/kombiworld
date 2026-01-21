import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        roles?: string[];
        companyIds?: string[];
      };
      userId?: string;
      companyId?: string;
    }
  }
}
