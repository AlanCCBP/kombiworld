const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllStops() {
  return await prisma.stop.findMany({
    include: {
      city: true,
      routeStops: true,
      startReservations: true,
      endReservations: true,
    },
  });
}

async function getStopById(id) {
  return await prisma.stop.findUnique({
    where: { id },
    include: {
      city: true,
      routeStops: true,
      startReservations: true,
      endReservations: true,
    },
  });
}

async function createStop(data) {
  try {
    const newStop = await prisma.stop.create({
      data: {
        name: data.name,
        cityId: data.cityId,
        latitude: data.latitude,
        longitude: data.longitude,
        routeStops: {
          create: data.routeStops.map((routeStop) => ({
            routeId: routeStop.routeId,
            order: routeStop.order,
          })),
        },
      },
      include: {
        city: true,
        routeStops: true,
        startReservations: true,
        endReservations: true,
      },
    });
    return newStop;
  } catch (error) {
    console.error('Error creating stop:', error);
    throw error;
  }
}

async function updateStop(id, data) {
  try {
    return await prisma.stop.update({
      where: { id },
      data,
      include: {
        city: true,
        routeStops: true,
        startReservations: true,
        endReservations: true,
      },
    });
  } catch (error) {
    console.error('Error updating stop:', error);
    throw new Error('Stop not found or update failed');
  }
}

async function deleteStop(id) {
  return await prisma.stop.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
};
