import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { validateItemAccess, validateTargetAccess } from "./accessChecker";

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
  accomplished: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateItemAccess(ctx.prisma, ctx.session, input.id);
      return ctx.prisma.prayerItem.update({
        where: {
          id: input.id,
        },
        data: {
          dateAccomplished: new Date(),
          accomplishedNotes: input.notes,
        },
      });
    }),
});
