import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../libs/jwt';
import { buildAuthContext } from '../libs/authContext';

declare global {
  namespace Express {
    interface Request {
      auth?: ReturnType<typeof buildAuthContext>;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  console.log('Authorization REQ:', req);
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = header.replace('Bearer ', '');

  try {
    const payload = verifyToken(token);

    const activeCompanyId = req.headers['x-company-id'] as string | undefined;

    req.auth = buildAuthContext(payload, activeCompanyId);

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
