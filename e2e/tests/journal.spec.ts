import { test } from "@playwright/test";
import { HomePage } from "../pages/home";

test.describe.serial("journal management", () => {
  const journalName = "journal management test";

  test("should be able to create a new journal", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyIsOnPage();
    await journalListPage.verifyHasNoJournal(journalName);
    await journalListPage.createNewJournal(journalName);
    await journalListPage.verifyHasJournal(journalName);
  });

  test("should be able to archive journal", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyHasJournal(journalName);

    const journalPage = await journalListPage.selectJournal(journalName);

    await journalPage.archiveJournal();

    await journalListPage.verifyIsOnPage();
  });

  test("should be able to unarchive journal", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyHasNoJournal(journalName);
    await journalListPage.showArchivedJournals();
    await journalListPage.verifyHasJournal(journalName);

    const journalPage = await journalListPage.selectJournal(journalName);

    await journalPage.unarchiveJournal();
    await journalPage.goHome();

    await journalListPage.verifyIsOnPage();
    await journalListPage.verifyHasJournal(journalName);
  });

  test("should be able to archive and delete journal", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyHasJournal(journalName);

    const journalPage = await journalListPage.selectJournal(journalName);

    await journalPage.archiveJournal();

    await journalListPage.verifyIsOnPage();

    await journalListPage.verifyHasNoJournal(journalName);
    await journalListPage.showArchivedJournals();
    await journalListPage.verifyHasJournal(journalName);

    await journalListPage.selectJournal(journalName);

    await journalPage.deleteJournal();

    await journalListPage.verifyIsOnPage();
    await journalListPage.verifyHasNoJournal(journalName);
  });
});
