import type { PrismaClient } from "@prisma/client";
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
  });
  return journal && journal.userId === session.user?.id;
}
