const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCities() {
  return await prisma.city.findMany({
    include: {
      stops: true,
      startRoutes: true,
      endRoutes: true,
    },
  });
}

async function getCityById(id) {
  return await prisma.city.findUnique({
    where: { id },
    include: {
      stops: true,
      startRoutes: true,
      endRoutes: true,
    },
  });
}

async function createCity(data) {
  try {
    const newCity = await prisma.city.create({
      data: {
        name: data.name,
        stops: {
          create: data.stops,
        },
        startRoutes: {
          create: data.startRoutes,
        },
        endRoutes: {
          create: data.endRoutes,
        },
      },
    });
    return newCity;
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
}

async function updateCity(id, data) {
  try {
    return await prisma.city.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating city:', error);
    throw new Error('City not found or update failed');
  }
}

async function deleteCity(id) {
  return await prisma.city.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
