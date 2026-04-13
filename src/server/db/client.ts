import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { env } from "../../env/server.mjs";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionUrl = new URL(env.DATABASE_URL);
// console.log("Connecting to database with URL:", env.DATABASE_URL);
const options = {
  host: connectionUrl.hostname,
  port: Number(connectionUrl.port) || 3306,
  user: connectionUrl.username,
  password: connectionUrl.password,
  database: connectionUrl.pathname.slice(1),
  ssl: true,
};
// console.log("Connecting to database with options:", options);
const adapter = new PrismaMariaDb(options);
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
