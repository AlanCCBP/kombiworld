import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string || 'your_secret_key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function generateToken(payload: object, expiresIn: string = EXPIRES_IN): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn } as SignOptions);
}

export function verifyToken(token: string): JwtPayload | string {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
