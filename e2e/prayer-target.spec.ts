import { type Page, test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal, setupBlankJournal } from "./utils/db";

test.describe.serial("prayer target", () => {
  const journalName = "prayer target test";

  const loginAndSelectJournal = async (page: Page) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyIsOnPage();

    await journalListPage.verifyHasJournal(journalName);

    return await journalListPage.selectJournal(journalName);
  };

  test.beforeAll("prepare journal", async () => {
    await setupBlankJournal(journalName);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  const targetNames = ["target 001", "target 002", "target 003"];

  test("can create new prayer targets", async ({ page }) => {
    const journalPage = await loginAndSelectJournal(page);

    await journalPage.verifyHasNoTarget(targetNames[0]!);

    for (const targetName of targetNames) {
      await journalPage.createTarget(targetName);
    }

    // targets are sorted by descending creation time
    await journalPage.verifyHasTargets(targetNames.reverse());
  });
});
