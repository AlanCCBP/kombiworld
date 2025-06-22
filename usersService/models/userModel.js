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

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...rest,
      updatedAt: new Date(),
    },
  });

  if (Array.isArray(roleIds)) {
    await prisma.userRole.deleteMany({
      where: { userId: id },
    });

    const newRoles = roleIds.map((roleId) => ({
      roleId,
      userId: id,
    }));

    await prisma.userRole.createMany({
      data: newRoles,
      skipDuplicates: true,
    });
  }

  return await prisma.user.findUnique({
    where: { id },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
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

exports.getUsers = async ({ page = 1, limit = 10, filterOptions = {} }) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(filterOptions.ids?.length && { id: { in: filterOptions.ids } }),
    ...(filterOptions.firstName && {
      firstName: { contains: filterOptions.firstName, mode: 'insensitive' },
    }),
    ...(filterOptions.lastName && {
      lastName: { contains: filterOptions.lastName, mode: 'insensitive' },
    }),
    ...(filterOptions.email && {
      email: { contains: filterOptions.email, mode: 'insensitive' },
    }),
    ...(filterOptions.docNumber && {
      docNumber: { contains: filterOptions.docNumber },
    }),
    ...(filterOptions.birthdate && {
      birthdate: new Date(filterOptions.birthdate),
    }),
    ...(filterOptions.status && { status: filterOptions.status }),
    ...(filterOptions.roles?.length && {
      userRoles: {
        some: {
          role: {
            name: { in: filterOptions.roles },
          },
        },
      },
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
