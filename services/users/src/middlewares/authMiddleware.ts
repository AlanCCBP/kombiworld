import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import type { JwtUserPayload } from '@/types/auth'; // si definiste un tipo para el JWT

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid Authorization format' });
  }

  try {
    const decoded = verifyToken(token) as JwtUserPayload;

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.body.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}
