const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllUsers() {
  return await prisma.user.findMany({
    include: {
      roles: true,
      reservations: true,
      drivenSchedules: true,
    },
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      roles: true,
      reservations: true,
      drivenSchedules: true,
    },
  });
}

async function createUser(data) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        roles: {
          connect: data.roles.map((roleId) => ({ id: roleId })),
        },
        reservations: {
          connect: data.reservations.map((reservationId) => ({
            id: reservationId,
          })),
        },
        drivenSchedules: {
          connect: data.drivenSchedules.map((scheduleId) => ({
            id: scheduleId,
          })),
        },
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(id, data) {
  try {
    return await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        lastName: data.lastName,
        roles: {
          connect: data.roles.map((roleId) => ({ id: roleId })),
        },
        reservations: {
          connect: data.reservations.map((reservationId) => ({
            id: reservationId,
          })),
        },
        drivenSchedules: {
          connect: data.drivenSchedules.map((scheduleId) => ({
            id: scheduleId,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('User not found or update failed');
  }
}

async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
