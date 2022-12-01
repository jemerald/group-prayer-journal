import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { hasAccessToJournal } from "./hasAccessToJournal";

async function validateTargetAccess(
  prisma: PrismaClient,
  session: Session,
  targetId: string
) {
  const target = await prisma.prayerTarget.findUnique({
    where: {
      id: targetId,
    },
  });
  if (
    !target ||
    !(await hasAccessToJournal(prisma, session, target.journalId))
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
}

export const itemRouter = router({
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
});
