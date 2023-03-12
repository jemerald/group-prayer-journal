import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { validateTargetAccess } from "../utils/accessChecker";

export const itemRouter = router({
  allByTargetId: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateTargetAccess(ctx.prisma, ctx.session, input.targetId);
      return ctx.prisma.prayerItem.findMany({
        where: {
          targetId: input.targetId,
        },
        orderBy: [
          {
            dateAccomplished: {
              sort: "desc",
              nulls: "first",
            },
          },
          {
            priority: "desc",
          },
          {
            dateBegins: "desc",
          },
        ],
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateTargetAccess(ctx.prisma, ctx.session, input.targetId);
      return ctx.prisma.prayerItem.create({
        data: {
          ...input,
        },
      });
    }),
  prioritize: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
        idsInPriorityOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateTargetAccess(ctx.prisma, ctx.session, input.targetId);
      const idToPriorityMap = input.idsInPriorityOrder.reduce(
        (acc, id, index) => ({
          ...acc,
          [id]: input.idsInPriorityOrder.length - index,
        }),
        {} as Record<string, number>
      );
      const items = await ctx.prisma.prayerItem.findMany({
        where: {
          targetId: input.targetId,
        },
      });
      return await Promise.all(
        items.map(async (item) => {
          if (idToPriorityMap[item.id]) {
            return await ctx.prisma.prayerItem.update({
              where: {
                id: item.id,
              },
              data: {
                priority: idToPriorityMap[item.id],
              },
            });
          } else {
            return item;
          }
        })
      );
    }),
});
