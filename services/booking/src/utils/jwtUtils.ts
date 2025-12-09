import jwt, { SignOptions } from 'jsonwebtoken';

const SECRET_KEY: string = process.env.JWT_SECRET || 'your_secret_key';
const EXPIRES_IN: number = Number(process.env.JWT_EXPIRES_IN) || 3600;

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: EXPIRES_IN };
  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
