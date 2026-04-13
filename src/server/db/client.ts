import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { env } from "../../env/server.mjs";

declare global {
  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb({});
export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
