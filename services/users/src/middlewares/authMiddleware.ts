import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config/jwt';

export const auth = (req: any, res: any, next: any) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_ACCESS_SECRET) as any;
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
