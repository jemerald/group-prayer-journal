import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

async function hasAccessToJournal(
  prisma: PrismaClient,
  session: Session,
  journalId: string
) {
  const journal = await prisma.prayerJournal.findFirst({
    where: {
      id: journalId,
    },
  });
  return journal && journal.userId === session.user?.id;
}

export const targetRouter = router({
  allByJournalId: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (
        !(await hasAccessToJournal(ctx.prisma, ctx.session, input.journalId))
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return ctx.prisma.prayerTarget.findMany({
        where: {
          journalId: input.journalId,
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
      const target = await ctx.prisma.prayerTarget.findUnique({
        where: {
          id: input.id,
        },
        include: {
          journal: true,
        },
      });
      if (
        !target ||
        !(await hasAccessToJournal(ctx.prisma, ctx.session, target.journalId))
      ) {
        return null;
      }
      return target;
    }),
  create: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(await hasAccessToJournal(ctx.prisma, ctx.session, input.journalId))
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return ctx.prisma.prayerTarget.create({
        data: {
          ...input,
          journalId: input.journalId,
        },
      });
    }),
});
