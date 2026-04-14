import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { env } from "../../env/server.mjs";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionUrl = new URL(env.DATABASE_URL);
const options = {
  host: connectionUrl.hostname,
  port: Number(connectionUrl.port) || 3306,
  user: connectionUrl.username,
  database: connectionUrl.pathname.slice(1),
  ssl: connectionUrl.searchParams.get("ssl-mode") === "REQUIRED",
};
console.log("Connecting to database with options:", options);
const adapter = new PrismaMariaDb({
  ...options,
  password: connectionUrl.password,
});
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
