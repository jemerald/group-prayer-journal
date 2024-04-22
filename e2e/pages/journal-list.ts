import { type Page, expect, test } from "@playwright/test";
import { JournalPage } from "./journal";

export class JournalListPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyIsOnPage() {
    await expect(this.pageHeader).toBeVisible();
  }

  async verifyHasJournal(name: string) {
    await expect(this.journal(name)).toBeVisible();
  }

  async verifyHasNoJournal(name: string) {
    await expect(this.journal(name)).not.toBeVisible();
  }

  async showArchivedJournals() {
    await test.step(`show archived journals`, async () => {
      await this.page.getByRole("button", { name: "Show archived" }).click();
    });
  }

  async createNewJournal(name: string, useEnterKey: boolean = false) {
    await test.step(`create journal ${name}`, async () => {
      await this.addButton.click();
      await expect(
        this.page.getByRole("heading", { name: "Create new prayer journal" })
      ).toBeVisible();

      await expect(this.nameInput).toBeVisible();
      await this.nameInput.fill(name);

      if (useEnterKey) {
        await this.page.keyboard.press("Enter");
      } else {
        await this.confirmButton.click();
      }
    });
  }

  async selectJournal(name: string): Promise<JournalPage> {
    return await test.step(`select journal ${name}`, async () => {
      await this.journal(name).click();
      await Promise.all([
        this.page.waitForURL((url) => url.pathname.startsWith("/journal/")),
        expect(this.pageHeader).not.toBeVisible(),
      ]);
      const journalPage = new JournalPage(this.page, name);
      await journalPage.verifyIsOnPage();
      return journalPage;
    });
  }

  private journal(name: string) {
    return this.page.getByRole("heading", { name, exact: true }).first();
  }

  get pageHeader() {
    return this.page.getByRole("heading", { name: "Prayer journals" });
  }

  get addButton() {
    return this.page.getByRole("button", { name: "Create new journal" });
  }

  get nameInput() {
    return this.page.getByRole("textbox", { name: "Name" });
  }

  get confirmButton() {
    return this.page.getByRole("button", { name: "Confirm" });
  }
}
