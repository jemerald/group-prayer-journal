import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const journalRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.prayerJournal.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        owner: true,
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
        include: {
          owner: true,
          accesses: {
            include: {
              user: true,
            },
          },
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
  shareWith: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        userEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.userEmail,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found, ask him to sign in first before sharing",
        });
      }
      return ctx.prisma.prayerJournalAccess.create({
        data: {
          journalId: input.id,
          userId: user.id,
        },
      });
    }),
});
