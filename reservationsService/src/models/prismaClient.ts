import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect();
    console.log('Disconnected Prisma Client');
  } catch (err) {
    console.error('Error disconnecting Prisma Client:', err);
  } finally {
    process.exit(0);
  }
});

export default prisma;
