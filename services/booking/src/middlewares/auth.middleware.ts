import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/src/utils/jwtUtils';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;
    req.userId = decoded.id;

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
