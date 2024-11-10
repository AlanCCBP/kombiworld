const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCities() {
  return await prisma.city.findMany();
}

async function getCityById(id) {
  return await prisma.city.findUnique({
    where: { id },
  });
}

async function createCity(data) {
  try {
    const newCity = await prisma.city.create({
      data: {
        name: data.name,
        stops: data.stops,
        startRoutes: data.startRoutes,
        endRoutes: data.endRoutes,
      },
    });
    return newCity;
  } catch (error) {
    console.error('Error creating city:', error);
    throw error;
  }
}

async function updateCity(id, data) {
  return await prisma.city.update({
    where: { id },
    data,
  });
}

async function deleteCity(id) {
  return await prisma.city.delete({
    where: { id },
  });
}

module.exports = {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity,
};
