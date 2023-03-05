import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  hasAccessToJournal,
  validateJournalAccess,
} from "../utils/accessChecker";

export const targetRouter = router({
  allByJournalId: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      validateJournalAccess(ctx.prisma, ctx.session, input.journalId);
      return ctx.prisma.prayerTarget.findMany({
        where: {
          journalId: input.journalId,
          archivedAt: null,
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
          items: {
            orderBy: [
              {
                dateAccomplished: {
                  sort: "desc",
                  nulls: "first",
                },
              },
              {
                dateBegins: "desc",
              },
            ],
          },
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
      validateJournalAccess(ctx.prisma, ctx.session, input.journalId);
      return ctx.prisma.prayerTarget.create({
        data: {
          ...input,
          journalId: input.journalId,
        },
      });
    }),
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const target = await ctx.prisma.prayerTarget.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      validateJournalAccess(ctx.prisma, ctx.session, target.journalId);
      return ctx.prisma.prayerTarget.update({
        where: {
          id: input.id,
        },
        data: {
          archivedAt: new Date(),
        },
      });
    }),
});
