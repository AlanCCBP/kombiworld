import { CompanyRole, GlobalRole } from '@/prisma/generated/prisma/enums';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_TTL = '15m';

export type JwtCompanyContext = {
  companyId: string;
  role: CompanyRole;
};

export type JwtPayload = {
  sub: string;
  globalRoles: GlobalRole[];
  companies: JwtCompanyContext[];
  tokenVersion: number;
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
