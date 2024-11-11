const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCars() {
  return await prisma.car.findMany({
    include: {
      schedules: true,
    },
  });
}

async function getCarById(id) {
  return await prisma.car.findUnique({
    where: { id },
    include: {
      schedules: true,
    },
  });
}

async function createCar(data) {
  try {
    const newCar = await prisma.car.create({
      data: {
        licensePlate: data.licensePlate,
        model: data.model,
        capacity: data.capacity,
      },
    });
    return newCar;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
}

async function updateCar(id, data) {
  try {
    return await prisma.car.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating car:', error);
    throw new Error('Car not found or update failed');
  }
}

async function deleteCar(id) {
  return await prisma.car.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
