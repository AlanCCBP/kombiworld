// models/prismaClient.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Manejar errores y cerrar la conexión al salir de la aplicación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected Prisma Client');
  process.exit(0);
});

module.exports = prisma;
