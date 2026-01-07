import { UserNotFoundError } from '@/src/errors/http-errors';
import { prisma } from '../../libs/prisma';
import { UserMeDTO } from './users.types';

export async function getMe(userId: string): Promise<UserMeDTO> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      globalRoles: {
        select: { role: true },
      },
      memberships: {
        where: { status: 'ACTIVE' },
        select: {
          role: true,
          status: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new UserNotFoundError();
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    globalRoles: user.globalRoles.map((r) => r.role),
    companies: user.memberships.map((m) => ({
      id: m.company.id,
      name: m.company.name,
      role: m.role,
      status: m.status,
    })),
  };
}
