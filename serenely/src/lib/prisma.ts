import { PrismaClient } from "@prisma/client";

// This page is for initializing and exporting the Prisma client, 
// which is used to interact with the database.


const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;