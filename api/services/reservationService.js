const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllReservations() {
  return await prisma.reservation.findMany({
    include: {
      user: true,
      schedule: true,
      startStop: true,
      endStop: true,
    },
  });
}

async function getReservationById(id) {
  return await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: true,
      schedule: true,
      startStop: true,
      endStop: true,
    },
  });
}

async function createReservation(data) {
  try {
    const newReservation = await prisma.reservation.create({
      data: {
        userId: data.userId,
        scheduleId: data.scheduleId,
        startStopId: data.startStopId,
        endStopId: data.endStopId,
      },
      include: {
        user: true,
        schedule: true,
        startStop: true,
        endStop: true,
      },
    });
    return newReservation;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

async function updateReservation(id, data) {
  try {
    return await prisma.reservation.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw new Error('Reservation not found or update failed');
  }
}

async function deleteReservation(id) {
  return await prisma.reservation.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
