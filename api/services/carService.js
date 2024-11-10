const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllCars() {
  return await prisma.car.findMany();
}

async function getCarById(id) {
  return await prisma.car.findUnique({
    where: { id },
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
  return await prisma.car.update({
    where: { id },
    data,
  });
}

async function deleteCar(id) {
  return await prisma.car.delete({
    where: { id },
  });
}

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
