import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  hasAccessToJournal,
  validateJournalAccess,
} from "../utils/accessChecker";

function targetList(prisma: PrismaClient, journalId: string) {
  return prisma.prayerTarget.findMany({
    where: {
      journalId,
      archivedAt: null,
    },
    orderBy: [
      {
        priority: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export const targetRouter = router({
  allByJournalId: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      validateJournalAccess(ctx.prisma, ctx.session, input.journalId);
      return targetList(ctx.prisma, input.journalId);
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
  prioritize: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
        idsInPriorityOrder: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      validateJournalAccess(ctx.prisma, ctx.session, input.journalId);
      const idToPriorityMap = input.idsInPriorityOrder.reduce(
        (acc, id, index) => ({
          ...acc,
          [id]: input.idsInPriorityOrder.length - index,
        }),
        {} as Record<string, number>
      );
      const targets = await ctx.prisma.prayerTarget.findMany({
        where: {
          journalId: input.journalId,
        },
      });
      return await Promise.all(
        targets.map(async (target) => {
          if (idToPriorityMap[target.id]) {
            return await ctx.prisma.prayerTarget.update({
              where: {
                id: target.id,
              },
              data: {
                priority: idToPriorityMap[target.id],
              },
            });
          } else {
            return target;
          }
        })
      );
    }),
});
