import path from "node:path";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  // Path absolut: URL relatif di .env tidak ke-resolve dari bundle .next saat runtime.
  new PrismaClient({
    datasourceUrl: `file:${path.join(process.cwd(), "dev.db")}`,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
