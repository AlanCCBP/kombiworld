const prisma = require('./prismaClient');

exports.createUser = async (userData) => {
  const { roleIds = [], ...userFields } = userData;

  return await prisma.user.create({
    data: {
      ...userFields,
      userRoles: {
        connect: roleIds.map((id) => ({ id })),
      },
    },
    include: { userRoles: true },
  });
};

exports.updateUser = async (userData) => {
  const { id, roleIds, ...rest } = userData;

  if (!id) throw new Error('Missing user id for update');

  return await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      ...(roleIds && {
        userRoles: {
          set: roleIds.map((id) => ({ id })),
        },
      }),
      updatedAt: new Date(),
    },
    include: { userRoles: true },
  });
};

exports.deleteUser = async (id) => {
  return await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      status: 'BANNED',
    },
  });
};

exports.findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });
};

exports.findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { userRoles: true },
  });
};

exports.getAllUsers = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { userRoles: true },
    }),
    prisma.user.count({
      where: { deletedAt: null },
    }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
