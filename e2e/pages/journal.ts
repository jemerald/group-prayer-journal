import { type Page, expect, test } from "@playwright/test";

export class JournalPage {
  private page: Page;
  private name: string;

  constructor(page: Page, name: string) {
    this.page = page;
    this.name = name;
  }

  async goHome() {
    await test.step("go home", async () => {
      await this.homeLink.click();
      await this.page.waitForURL("/");
    });
  }

  async verifyIsOnPage() {
    await test.step("verify is on journal page", async () => {
      await expect(
        this.page.getByRole("heading", { name: this.name })
      ).toBeVisible();
      const nav = this.page.getByRole("navigation");
      await expect(nav).toBeVisible();

      await expect(this.homeLink).toBeVisible();
      const navListTextContents = await nav
        .getByRole("listitem")
        .allTextContents();
      expect(navListTextContents).toEqual(["Home", this.name]);
    });
  }

  async archiveJournal() {
    await test.step("archive journal", async () => {
      await expect(this.archiveButton).toBeVisible();
      await this.archiveButton.click();
      await expect(
        this.page.getByRole("heading", { name: "Archive prayer journal" })
      ).toBeVisible();
      await this.confirmButton.click();
    });
  }

  async unarchiveJournal() {
    await test.step("unarchive journal", async () => {
      await expect(this.unarchiveButton).toBeVisible();
      await this.unarchiveButton.click();
      await expect(this.unarchiveButton).not.toBeVisible();
    });
  }

  async deleteJournal() {
    await test.step("delete journal", async () => {
      await this.deleteButton.click();
      await expect(
        this.page.getByRole("heading", {
          name: "Are you sure that you want to delete?",
        })
      ).toBeVisible();
      await this.confirmButton.click();
    });
  }

  private get homeLink() {
    return this.page
      .getByRole("navigation")
      .getByRole("link", { name: "Home" });
  }

  private get archiveButton() {
    return this.page.getByRole("button", { name: "Archive journal" });
  }

  private get unarchiveButton() {
    return this.page.getByRole("button", { name: "Unarchive journal" });
  }

  private get deleteButton() {
    return this.page.getByRole("button", { name: "Delete journal" });
  }

  private get confirmButton() {
    return this.page.getByRole("button", { name: "Confirm" });
  }
}
