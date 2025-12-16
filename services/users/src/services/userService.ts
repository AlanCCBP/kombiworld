import { prisma } from '@/src/lib/prisma';
import {
  CreateUserInput,
  LoginInput,
  RegisterUserInput,
  UpdateUserInput,
} from '@/src/types/user.types';
import { compare, hash } from 'bcrypt';

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

const loginUser = async (data: LoginInput) => {
  const { email } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: { include: { role: true } },
    },
  });

  if (!existingUser) {
    throw new Error(`User with email ${data.email} does not exist.`);
  }

  const validPassword = await compare(data.password, existingUser.password);

  if (!validPassword) {
    throw new Error('Invalid credentials');
  }

  const { password, ...safeUser } = existingUser;

  return safeUser;
};

const registerUser = async (data: RegisterUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error(`User with email ${data.email} already exists.`);
  }

  const hashedPassword = await hash(data.password, 10);

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      userRoles: {
        create: {
          role: { connect: { name: 'USER' } },
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
      userRoles: {
        select: {
          role: true,
        },
      },
    },
  });

  return newUser;
};

export default {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  registerUser,
};
