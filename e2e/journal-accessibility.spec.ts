import { test } from "@playwright/test";
import { HomePage } from "./pages/home";
import { deleteJournal } from "./utils/db";

test.describe("journal accessiblity", () => {
  const journalName = "journal accessiblity test";

  test.beforeAll("clean up olds journals", async () => {
    await deleteJournal(journalName);
  });

  test.afterAll("clean up journals", async () => {
    await deleteJournal(journalName);
  });

  test("should be able to create a new journal with keyboard", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    const journalListPage = await homePage.signInWithTestUser();

    await journalListPage.verifyIsOnPage();
    await journalListPage.verifyHasNoJournal(journalName);
    await journalListPage.createNewJournal(journalName, true);
    await journalListPage.verifyHasJournal(journalName);
  });
});
