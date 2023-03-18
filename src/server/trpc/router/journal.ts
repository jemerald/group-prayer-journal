import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  hasAccessToJournal,
  validateJournalAccess,
} from "../utils/accessChecker";
import { getRandomPhoto } from "../utils/randomPhoto";

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
        archivedAt: null,
      },
      include: {
        cover: true,
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
          cover: true,
        },
      });
    }),
  usersOfJournal: protectedProcedure
    .input(
      z.object({
        journalId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      await validateJournalAccess(ctx.prisma, ctx.session, input.journalId);
      return await ctx.prisma.prayerJournal.findFirst({
        where: {
          id: input.journalId,
        },
        select: {
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
      const photo = await getRandomPhoto();
      const journal = await ctx.prisma.prayerJournal.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
      if (photo) {
        await ctx.prisma.prayerJournalCover.create({
          data: {
            journalId: journal.id,
            url: photo.url,
            color: photo.color,
            blurHash: photo.blurHash,
          },
        });
      }
    }),
  rename: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateJournalAccess(ctx.prisma, ctx.session, input.id);
      await ctx.prisma.prayerJournal.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
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
      await validateJournalAccess(ctx.prisma, ctx.session, input.id);
      const photo = await getRandomPhoto();
      if (photo) {
        await ctx.prisma.prayerJournalCover.upsert({
          where: {
            journalId: input.id,
          },
          create: {
            journalId: input.id,
            url: photo.url,
            color: photo.color,
            blurHash: photo.blurHash,
          },
          update: {
            url: photo.url,
            color: photo.color,
            blurHash: photo.blurHash,
          },
        });
      }
    }),
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await validateJournalAccess(ctx.prisma, ctx.session, input.id);
      return ctx.prisma.prayerJournal.update({
        where: {
          id: input.id,
        },
        data: {
          archivedAt: new Date(),
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
      await validateJournalAccess(ctx.prisma, ctx.session, input.id);
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
