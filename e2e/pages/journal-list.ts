import { type Page, expect } from "@playwright/test";
import { JournalPage } from "./journal";

export class JournalListPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyIsOnPage() {
    await expect(
      this.page.getByRole("heading", { name: "Prayer journals" })
    ).toBeVisible();
  }

  async verifyHasJournal(name: string) {
    await expect(this.journal(name)).toBeVisible();
  }

  async verifyNotHasJournal(name: string) {
    await expect(this.journal(name)).not.toBeVisible();
  }

  async createNewJournal(name: string) {
    await this.addButton.click();
    await expect(
      this.page.getByRole("heading", { name: "Create new prayer journal" })
    ).toBeVisible();

    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);

    await this.createButton.click();
  }

  async selectJournal(name: string): Promise<JournalPage> {
    await this.journal(name).click();
    return new JournalPage(this.page, name);
  }

  private journal(name: string) {
    return this.page.getByRole("heading", { name, exact: true });
  }

  get addButton() {
    return this.page.getByRole("button", { name: "add" });
  }

  get nameInput() {
    return this.page.getByRole("textbox", { name: "Name" });
  }

  get createButton() {
    return this.page.getByRole("button", { name: "Create" });
  }
}
