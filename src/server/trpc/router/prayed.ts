import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { validateItemAccess } from "../utils/accessChecker";

export const prayedRouter = router({
  allByItemId: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);
      return ctx.prisma.prayed.findMany({
        where: {
          itemId: input.itemId,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);

      return await ctx.prisma.prayed.create({
        data: {
          ...input,
        },
      });
    }),
});
