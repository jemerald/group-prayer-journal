import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const healthRouter = router({
  status: publicProcedure.query(async ({ ctx }) => {
    try {
      await ctx.prisma.$executeRaw`select 1 from User`;
      return { status: "ok" };
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
