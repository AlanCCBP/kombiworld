import { prisma } from '@/lib/prisma';
import { CreateUserInput, UpdateUserInput } from '@/types/user.types';

export const createUser = async (data: CreateUserInput) => {
  const { roleIds, password, ...fields } = data;

  return prisma.user.create({
    data: {
      ...fields,
      password, // suponiendo que ya viene hasheado
      userRoles: {
        createMany: {
          data: roleIds!.map((roleId: number) => ({ roleId })),
        },
      },
    },
    include: {
      userRoles: { include: { role: true } },
    },
  });
};

export const updateUser = async (userId: string, data: UpdateUserInput) => {
  const { roleIds, ...fields } = data;

  return prisma.$transaction(async (tx) => {
    // Update base fields
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: fields,
    });

    if (roleIds) {
      // Clear roles
      await tx.userRole.deleteMany({
        where: { userId },
      });

      // Insert new roles
      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({ roleId, userId })),
        });
      }
    }

    return tx.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: { include: { role: true } },
      },
    });
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: { include: { role: true } },
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      userRoles: { include: { role: true } },
    },
  });
};
