import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { hasAccessToJournal } from "./hasAccessToJournal";

export const itemRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const target = await ctx.prisma.prayerTarget.findUnique({
        where: {
          id: input.targetId,
        },
      });
      if (
        !target ||
        !(await hasAccessToJournal(ctx.prisma, ctx.session, target.journalId))
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      return ctx.prisma.prayerItem.create({
        data: {
          ...input,
        },
      });
    }),
});
