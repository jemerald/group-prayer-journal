import { router } from "../trpc";
import { authRouter } from "./auth";
import { itemRouter } from "./item";
import { journalRouter } from "./journal";
import { prayedRouter } from "./prayed";
import { targetRouter } from "./target";

export const appRouter = router({
  auth: authRouter,
  journal: journalRouter,
  target: targetRouter,
  item: itemRouter,
  prayed: prayedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
