import { test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal, createJournal } from "./utils/db";

test.describe("prayer item accessiblity", () => {
  const journalName = "prayer item accessiblity test journal";
  const targetName = "prayer item accessiblity test target";

  test.beforeAll("prepare target", async () => {
    await createJournal(journalName, [targetName]);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  const itemName = "item 001";

  test("can create new prayer items", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);
    const targetPage = await journalPage.selectTarget(targetName);

    await targetPage.verifyHasItems([]);

    await targetPage.createItem(itemName, true);

    // targets are sorted by descending creation time
    await targetPage.verifyHasItems([itemName]);
  });
});
