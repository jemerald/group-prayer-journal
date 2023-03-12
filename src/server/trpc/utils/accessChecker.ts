import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import type { Session } from "next-auth";

export async function hasAccessToJournal(
  prisma: PrismaClient,
  session: Session,
  journalId: string
) {
  const journal = await prisma.prayerJournal.findFirst({
    where: {
      id: journalId,
    },
    include: {
      accesses: true,
    },
  });
  return (
    journal &&
    (journal.userId === session.user?.id ||
      journal.accesses.some((access) => access.userId === session.user?.id))
  );
}

export async function validateJournalAccess(
  prisma: PrismaClient,
  session: Session,
  journalId: string
) {
  if (!(await hasAccessToJournal(prisma, session, journalId))) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

export async function validateTargetAccess(
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
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

export async function validateItemAccess(
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
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return item;
}
