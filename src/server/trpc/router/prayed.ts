import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { hasAccessToJournal } from "./hasAccessToJournal";

async function validateItemAccess(
  prisma: PrismaClient,
  session: Session,
  itemId: string
) {
  const item = await prisma.prayerItem.findUnique({
    where: {
      id: itemId,
    },
    include: {
      target: true,
    },
  });
  if (
    !item ||
    !(await hasAccessToJournal(prisma, session, item.target.journalId))
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
}

export const prayedRouter = router({
  allByItemId: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);
      return ctx.prisma.prayed.findMany({
        where: {
          itemId: input.itemId,
        },
        orderBy: {
          date: "desc",
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.itemId);

      return await ctx.prisma.prayed.create({
        data: {
          ...input,
        },
      });
    }),
});
