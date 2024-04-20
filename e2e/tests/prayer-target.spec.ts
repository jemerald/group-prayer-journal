import { type Page, test } from "@playwright/test";
import { HomePage } from "../pages/home";
import { deleteJournal, setupBlankJournal } from "../utils/db";

test.describe.serial("prayer target", () => {
  const journalName = "prayer target test";

  const login = async (page: Page) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyIsOnPage();

    return journalListPage;
  };

  const loginAndSelectJournal = async (page: Page) => {
    const journalListPage = await login(page);

    await journalListPage.verifyHasJournal(journalName);

    return await journalListPage.selectJournal(journalName);
  };

  test.beforeAll("prepare journal", async () => {
    await setupBlankJournal(journalName);
  });

  test.afterAll("clean up journal", async () => {
    await deleteJournal(journalName);
  });

  test("can create new prayer target", async ({ page }) => {
    const journalPage = await loginAndSelectJournal(page);
    const target1 = "target 1";
    await journalPage.verifyHasNoTarget(target1);
    await journalPage.createTarget(target1);
    await journalPage.verifyHasTarget(target1);
  });
});
