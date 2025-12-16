import { verify } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/src/utils/jwtUtils';
import bcrypt from 'bcryptjs';
import { JWT_REFRESH_SECRET } from '../config/jwt';

export const loginUser = async (email: string, password: string) => {
  const loggedInUser = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: { include: { role: true } },
    },
  });

  if (!loggedInUser) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, loggedInUser.password);
  if (!valid) throw new Error('Invalid credentials');

  const accessPayload = {
    id: loggedInUser.id,
    email: loggedInUser.email,
    roles: loggedInUser.userRoles.map((ur) => ur.role.name),
  };

  const accessToken = generateAccessToken(accessPayload);
  const refreshToken = generateRefreshToken(
    loggedInUser.id,
    loggedInUser.tokenVersion,
  );

  const { password: _, ...safeUser } = loggedInUser;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

export const refreshSession = async (token: string) => {
  const payload = verify(token, JWT_REFRESH_SECRET) as any;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) throw new Error('User not found');

  // validar version del token
  if (payload.version !== user.tokenVersion) {
    throw new Error('Invalid refresh token');
  }

  // OPCIONAL: Rotar tokenVersion para que el refresh token viejo quede invalidado
  await prisma.user.update({
    where: { id: user.id },
    data: { tokenVersion: user.tokenVersion + 1 },
  });

  const newAccess = generateAccessToken(user);
  const newRefresh = generateRefreshToken({
    id: user.id,
    tokenVersion: user.tokenVersion + 1,
  });

  return { accessToken: newAccess, refreshToken: newRefresh };
};
