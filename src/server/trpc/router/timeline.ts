import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  validateItemAccess,
  validateTargetAccess,
} from "../utils/accessChecker";

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
  allByTargetId: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateTargetAccess(ctx.prisma, ctx.session, input.targetId);
      return ctx.prisma.timeline.findMany({
        where: {
          targetId: input.targetId,
        },
        include: {
          item: true,
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
  lastPrayedForTarget: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateTargetAccess(ctx.prisma, ctx.session, input.targetId);
      return ctx.prisma.timeline.findFirst({
        where: {
          targetId: input.targetId,
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
  addNote: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        note: z.string(),
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
          type: "NOTE",
        },
      });
    }),
  accomplished: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await validateItemAccess(
        ctx.prisma,
        ctx.session,
        input.itemId
      );
      await ctx.prisma.prayerItem.update({
        where: {
          id: input.itemId,
        },
        data: {
          dateAccomplished: new Date(),
        },
      });
      return ctx.prisma.timeline.create({
        data: {
          ...input,
          targetId: item.targetId,
          type: "ACCOMPLISHED",
        },
      });
    }),
});
