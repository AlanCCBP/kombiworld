const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllUserRoles() {
  return await prisma.userRole.findMany({
    include: {
      users: true,
    },
  });
}

async function getUserRoleById(id) {
  return await prisma.userRole.findUnique({
    where: { id },
    include: {
      users: true,
    },
  });
}

async function createUserRole(data) {
  try {
    const newUserRole = await prisma.userRole.create({
      data: {
        name: data.name,
        users: {
          connect: data.users.map((userId) => ({ id: userId })),
        },
      },
    });
    return newUserRole;
  } catch (error) {
    console.error('Error creating user role:', error);
    throw error;
  }
}

async function updateUserRole(id, data) {
  try {
    return await prisma.userRole.update({
      where: { id },
      data: {
        name: data.name,
        users: {
          connect: data.users.map((userId) => ({ id: userId })),
        },
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error('User role not found or update failed');
  }
}

async function deleteUserRole(id) {
  return await prisma.userRole.delete({
    where: { id },
  });
}

module.exports = {
  getAllUserRoles,
  getUserRoleById,
  createUserRole,
  updateUserRole,
  deleteUserRole,
};
