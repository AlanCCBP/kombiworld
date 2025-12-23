import { GlobalRole } from '@/prisma/generated/prisma/enums';
import { comparePassword, hashPassword } from '@/src/libs/hash';
import { signAccessToken, signRefreshToken, verifyToken } from '@/src/libs/jwt';
import { prisma } from '@/src/libs/prisma';

export const registerUser = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const exists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (exists) throw new Error('User already exists');

  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: await hashPassword(data.password),
      globalRoles: {
        create: {
          role: GlobalRole.SUPPORT,
        },
      },
    },
  });

  return {
    accessToken: signAccessToken({
      sub: user.id,
      globalRoles: [GlobalRole.SUPPORT],
      companies: [],
      tokenVersion: user.tokenVersion,
    }),
    refreshToken: signRefreshToken({
      sub: user.id,
      globalRoles: [GlobalRole.SUPPORT],
      companies: [],
      tokenVersion: user.tokenVersion,
    }),
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      globalRoles: true,
      memberships: {
        where: { status: 'ACTIVE' },
      },
    },
  });

  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error('Invalid credentials');

  const globalRoles = user.globalRoles.map((r) => r.role);

  const companies = user.memberships.map((m) => ({
    companyId: m.companyId,
    role: m.role,
  }));

  const payload = {
    sub: user.id,
    globalRoles,
    companies,
    tokenVersion: user.tokenVersion,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const refreshToken = async (refreshToken: string) => {
  const payload = verifyToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: {
      globalRoles: true,
      memberships: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    throw new Error('Token revoked');
  }

  const newPayload = {
    sub: user.id,
    tokenVersion: user.tokenVersion,
    globalRoles: user.globalRoles.map((r) => r.role),
    companies: user.memberships.map((m) => ({
      companyId: m.companyId,
      role: m.role,
    })),
  };

  return {
    accessToken: signAccessToken(newPayload),
    refreshToken: signRefreshToken(newPayload),
  };
};

export const logoutUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
};
