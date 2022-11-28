import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const journalRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.prayerJournal.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  byId: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const journal = await ctx.prisma.prayerJournal.findFirst({
        where: {
          id: input.id,
        },
      });
      if (journal && journal.userId === ctx.session.user.id) {
        return journal;
      }
      return null;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.prayerJournal.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),
});
