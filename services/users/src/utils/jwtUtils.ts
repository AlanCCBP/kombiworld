import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES,
  REFRESH_TOKEN_EXPIRES,
} from '@/src/config/jwt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = (process.env.JWT_SECRET as string) || 'your_secret_key';

export const generateAccessToken = (user: { id: string }) => {
  return jwt.sign({ userId: user.id }, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
};

export const generateRefreshToken = (user: {
  id: string;
  tokenVersion: number;
}) => {
  return jwt.sign(
    { userId: user.id, version: user.tokenVersion },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES },
  );
};

export function verifyToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
