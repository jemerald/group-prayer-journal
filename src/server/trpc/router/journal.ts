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
