const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllRoutes() {
  return await prisma.route.findMany({
    include: {
      startCity: true,
      endCity: true,
      stops: {
        include: {
          stop: true,
        },
      },
      schedules: true,
    },
  });
}

async function getRouteById(id) {
  return await prisma.route.findUnique({
    where: { id },
    include: {
      startCity: true,
      endCity: true,
      stops: {
        include: {
          stop: true,
        },
      },
      schedules: true,
    },
  });
}

async function createRoute(data) {
  try {
    const newRoute = await prisma.route.create({
      data: {
        name: data.name,
        startCityId: data.startCityId,
        endCityId: data.endCityId,
        stops: {
          create: data.stops.map((stop) => ({
            stopId: stop.stopId,
          })),
        },
        schedules: {
          create: data.schedules,
        },
      },
      include: {
        startCity: true,
        endCity: true,
        stops: true,
        schedules: true,
      },
    });
    return newRoute;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
}

async function updateRoute(id, data) {
  try {
    return await prisma.route.update({
      where: { id },
      data,
      include: {
        startCity: true,
        endCity: true,
        stops: true,
        schedules: true,
      },
    });
  } catch (error) {
    console.error('Error updating route:', error);
    throw new Error('Route not found or update failed');
  }
}

async function deleteRoute(id) {
  return await prisma.route.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
