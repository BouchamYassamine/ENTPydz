import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Prévenir les multiples instances de Prisma Client en développement
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
