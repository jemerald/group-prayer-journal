import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { hasAccessToJournal } from "./hasAccessToJournal";

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
          code: "FORBIDDEN",
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
          items: true,
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
          code: "FORBIDDEN",
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
