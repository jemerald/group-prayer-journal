import { test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal, createJournal } from "./utils/db";

test.describe.serial("prayer target", () => {
  const journalName = "prayer target test";

  test.beforeAll("prepare journal", async () => {
    await createJournal(journalName);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  const targetNames = ["target 001", "target 002", "target 003"] as const;

  test("can create new prayer targets", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);

    await journalPage.verifyHasTargets([]);

    for (const targetName of targetNames) {
      await journalPage.createTarget(targetName);
    }

    // targets are sorted by descending creation time
    await journalPage.verifyHasTargets([...targetNames].reverse());
  });

  test("can reorder prayer targets", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);

    await journalPage.verifyHasTargets([...targetNames].reverse());

    await journalPage.reorderTarget(targetNames[2], targetNames[1]);

    await journalPage.verifyHasTargets([
      targetNames[1],
      targetNames[2],
      targetNames[0],
    ]);
  });

  test("can archive prayer target", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);

    const targetPage = await journalPage.selectTarget(targetNames[1]);
    await targetPage.archiveTarget();

    await journalPage.verifyIsOnPage();
    await journalPage.waitForFetchingComplete();

    await journalPage.verifyHasTargets([targetNames[2], targetNames[0]]);
  });
});
