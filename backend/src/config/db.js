const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Keep connection alive - ping every 4 minutes to prevent Neon sleep
const keepAlive = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    // Reconnect silently
    try {
      await prisma.$disconnect();
      await prisma.$connect();
    } catch {}
  }
};

setInterval(keepAlive, 4 * 60 * 1000);

module.exports = prisma;
