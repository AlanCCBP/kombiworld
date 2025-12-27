import { prisma } from '@/src/libs/prisma';
import { GlobalRole } from '@/prisma/generated/prisma/enums';
import { comparePassword, hashPassword } from '@/src/libs/hash';
import { signAccessToken, verifyToken } from '@/src/libs/jwt';
import {
  generateRefreshToken,
  hashRefreshToken,
} from '@/src/libs/refreshToken';

const REFRESH_TTL_DAYS = 7;

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await hashPassword(data.password),
      globalRoles: {
        create: { role: GlobalRole.SUPPORT },
      },
    },
  });

  const refreshToken = await createSession(user.id);

  const accessToken = signAccessToken({
    sub: user.id,
    globalRoles: [GlobalRole.SUPPORT],
    companies: [],
    tokenVersion: user.tokenVersion,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      globalRoles: true,
      memberships: { where: { status: 'ACTIVE' } },
    },
  });

  if (!user) throw new Error('Invalid credentials');
  if (!(await comparePassword(password, user.password)))
    throw new Error('Invalid credentials');

  const payload = {
    sub: user.id,
    tokenVersion: user.tokenVersion,
    globalRoles: user.globalRoles.map((r) => r.role),
    companies: user.memberships.map((m) => ({
      companyId: m.companyId,
      role: m.role,
    })),
  };

  const refreshToken = await createSession(user.id);
  const accessToken = signAccessToken(payload);

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (rawToken: string) => {
  const tokenHash = hashRefreshToken(rawToken);

  const stored = await prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: {
        include: {
          globalRoles: true,
          memberships: true,
        },
      },
    },
  });

  if (!stored) throw new Error('Invalid refresh token');

  const user = stored.user;

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });

  const newRefresh = await createSession(user.id);

  const payload = {
    sub: user.id,
    tokenVersion: user.tokenVersion,
    globalRoles: user.globalRoles.map((r) => r.role),
    companies: user.memberships.map((m) => ({
      companyId: m.companyId,
      role: m.role,
    })),
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: newRefresh,
  };
};

export const logoutUser = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
};

export async function createSession(userId: string) {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });

  return refreshToken;
}
