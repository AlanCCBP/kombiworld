import { prisma } from '../lib/prisma';

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
