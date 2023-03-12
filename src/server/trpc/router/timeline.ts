import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { validateItemAccess } from "../utils/accessChecker";

export const timelineRouter = router({
  allByItemId: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);
      return ctx.prisma.timeline.findMany({
        where: {
          itemId: input.itemId,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  lastPrayedForItem: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);
      return ctx.prisma.timeline.findFirst({
        where: {
          itemId: input.itemId,
          type: "PRAYED",
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  prayedNow: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await validateItemAccess(
        ctx.prisma,
        ctx.session,
        input.itemId
      );

      return await ctx.prisma.timeline.create({
        data: {
          ...input,
          targetId: item.targetId,
          type: "PRAYED",
        },
      });
    }),
});
