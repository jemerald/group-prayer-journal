import { test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal, createJournal } from "./utils/db";

test.describe.serial("prayer item", () => {
  const journalName = "prayer item test journal";
  const targetName = "prayer item test target";

  test.beforeAll("prepare target", async () => {
    await createJournal(journalName, [targetName]);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  const itemNames = ["item 001", "item 002", "item 003"] as const;

  test("can create new prayer items", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);
    const targetPage = await journalPage.selectTarget(targetName);

    await targetPage.verifyHasItems([]);

    for (const itemName of itemNames) {
      await targetPage.createItem(itemName);
    }

    // targets are sorted by descending creation time
    await targetPage.verifyHasItems([...itemNames].reverse());
  });

  test("can reorder prayer items", async ({ page }) => {
    const homePage = new HomePage(page);
    const journalPage = await homePage.loginAndSelectJournal(journalName);
    const targetPage = await journalPage.selectTarget(targetName);

    await targetPage.verifyHasItems([...itemNames].reverse());

    await targetPage.reorderItem(itemNames[2], itemNames[1]);

    await targetPage.verifyHasItems([itemNames[1], itemNames[2], itemNames[0]]);
  });
});
