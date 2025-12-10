import { prisma } from '@/src/lib/prisma';
import { CreateUserInput, UpdateUserInput } from '@/src/types/user.types';

const createUser = async (data: CreateUserInput) => {
  const { roleIds, password, ...fields } = data;

  return prisma.user.create({
    data: {
      ...fields,
      password,
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

const updateUser = async (userId: string, data: UpdateUserInput) => {
  const { roleIds, ...fields } = data;

  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: fields,
    });

    if (roleIds) {
      await tx.userRole.deleteMany({
        where: { userId },
      });

      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId: number) => ({ roleId, userId })),
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

const deleteUser = async (userId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
    },
  });
};

const getUser = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: { include: { role: true } },
    },
  });
};

const getUsers = async () => {
  return prisma.user.findMany({
    where: { deletedAt: null },
    include: {
      userRoles: { include: { role: true } },
    },
  });
};

export default {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
};
