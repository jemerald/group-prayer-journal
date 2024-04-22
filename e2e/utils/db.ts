import { prisma } from "../../src/server/db/client";

const TestUserId = "test-user-1";
export const TestUserName = "Test User 1";

export async function setupTestUser() {
  try {
    await prisma.user.upsert({
      where: {
        id: TestUserId,
      },
      create: {
        id: TestUserId,
        name: TestUserName,
        email: "test1.local.host",
      },
      update: {
        name: TestUserName,
        email: "test1.local.host",
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to setup test user");
  }
}

export async function createJournal(
  name: string,
  targetNames: string[] = [],
  userId: string = TestUserId
) {
  try {
    await prisma.prayerJournal.deleteMany({
      where: {
        userId,
        name,
      },
    });
    const journal = await prisma.prayerJournal.create({
      data: {
        userId,
        name,
      },
    });
    if (targetNames.length > 0) {
      await prisma.prayerTarget.createMany({
        data: targetNames.map((targetName) => ({
          journalId: journal.id,
          name: targetName,
        })),
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Failed to setup journal");
  }
}

export async function deleteJournal(name: string, userId: string = TestUserId) {
  try {
    await prisma.prayerJournal.deleteMany({
      where: {
        userId,
        name,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete journal");
  }
}
