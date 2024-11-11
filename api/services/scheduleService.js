const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllSchedules() {
  return await prisma.schedule.findMany({
    include: {
      route: true,
      car: true,
      driver: true,
      reservations: true,
    },
  });
}

async function getScheduleById(id) {
  return await prisma.schedule.findUnique({
    where: { id },
    include: {
      route: true,
      car: true,
      driver: true,
      reservations: true,
    },
  });
}

async function createSchedule(data) {
  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        routeId: data.routeId,
        carId: data.carId,
        driverId: data.driverId,
        departureTime: data.departureTime,
        arrivalTime: data.arrivalTime,
        reservations: {
          create: data.reservations.map((reservation) => ({
            userId: reservation.userId,
            startStopId: reservation.startStopId,
            endStopId: reservation.endStopId,
          })),
        },
      },
      include: {
        route: true,
        car: true,
        driver: true,
        reservations: true,
      },
    });
    return newSchedule;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}

async function updateSchedule(id, data) {
  try {
    return await prisma.schedule.update({
      where: { id },
      data,
      include: {
        route: true,
        car: true,
        driver: true,
        reservations: true,
      },
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw new Error('Schedule not found or update failed');
  }
}

async function deleteSchedule(id) {
  return await prisma.schedule.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
