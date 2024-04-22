import { test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal, createJournal } from "./utils/db";

test.describe("prayer target accessiblity", () => {
  const journalName = "prayer target accessiblity test";

  test.beforeAll("prepare journal", async () => {
    await createJournal(journalName);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  const targetName = "target 001";

  test("can create new prayer targets", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);

    await journalPage.verifyHasTargets([]);

    await journalPage.createTarget(targetName, true);

    // targets are sorted by descending creation time
    await journalPage.verifyHasTargets([targetName]);
  });
});
