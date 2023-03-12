import { router } from "../trpc";
import { authRouter } from "./auth";
import { itemRouter } from "./item";
import { journalRouter } from "./journal";
import { targetRouter } from "./target";
import { timelineRouter } from "./timeline";

export const appRouter = router({
  auth: authRouter,
  journal: journalRouter,
  target: targetRouter,
  item: itemRouter,
  timeline: timelineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
