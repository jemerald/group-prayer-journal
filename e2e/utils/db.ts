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
  }
}

export async function setupBlankJournal(
  name: string,
  userId: string = TestUserId
) {
  try {
    await prisma.prayerJournal.deleteMany({
      where: {
        userId,
        name,
      },
    });
    await prisma.prayerJournal.create({
      data: {
        userId,
        name,
      },
    });
  } catch (err) {
    console.log(err);
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
  }
}
