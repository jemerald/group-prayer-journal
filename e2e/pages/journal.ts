import { type Page, expect } from "@playwright/test";

export class JournalPage {
  private page: Page;
  private name: string;

  constructor(page: Page, name: string) {
    this.page = page;
    this.name = name;
  }

  async verifyIsOnPage() {
    await expect(
      this.page.getByRole("heading", { name: this.name })
    ).toBeVisible();
    const nav = this.page.getByRole("navigation");
    await expect(nav).toBeVisible();

    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    const navListTextContents = await nav
      .getByRole("listitem")
      .allTextContents();
    expect(navListTextContents).toEqual(["Home", this.name]);
  }

  async archiveJournal() {
    await this.archiveButton.click();
    await expect(
      this.page.getByRole("heading", { name: "Archive prayer journal" })
    ).toBeVisible();
    await this.confirmArchiveButton.click();
  }

  private get archiveButton() {
    return this.page.getByRole("button", { name: "Archive journal" });
  }

  private get confirmArchiveButton() {
    return this.page.getByRole("button", { name: "Archive" });
  }
}
