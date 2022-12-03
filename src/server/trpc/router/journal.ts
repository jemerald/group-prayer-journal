import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  hasAccessToJournal,
  validateJournalAccess,
} from "../utils/accessChecker";
import { getRandomPhotoUrl } from "../utils/randomPhoto";

export const journalRouter = router({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.prayerJournal.findMany({
      where: {
        OR: [
          {
            userId: ctx.session.user.id,
          },
          {
            accesses: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        ],
      },
      include: {
        owner: true,
        accesses: {
          include: {
            user: true,
          },
        },
        _count: {
          select: { targets: true },
        },
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
      if (!(await hasAccessToJournal(ctx.prisma, ctx.session, input.id))) {
        return null;
      }
      return await ctx.prisma.prayerJournal.findFirst({
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
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const photoUrl = await getRandomPhotoUrl();
      return ctx.prisma.prayerJournal.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          coverImageUrl: photoUrl,
        },
      });
    }),
  changeCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      validateJournalAccess(ctx.prisma, ctx.session, input.id);
      const photoUrl = await getRandomPhotoUrl();
      return ctx.prisma.prayerJournal.update({
        where: {
          id: input.id,
        },
        data: {
          coverImageUrl: photoUrl,
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
      validateJournalAccess(ctx.prisma, ctx.session, input.id);
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
