import { type Page, expect, test } from "@playwright/test";
import { TargetPage } from "./target";
import { dragTo } from "./utils";

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
      await expect(this.pageHeader).toBeVisible();
      const nav = this.page.getByRole("navigation");
      await expect(nav).toBeVisible();

      await expect(this.homeLink).toBeVisible();
      const navListTextContents = await nav
        .getByRole("listitem")
        .allTextContents();
      expect(navListTextContents).toEqual(["Home", this.name]);
    });
  }

  async waitForFetchingComplete() {
    await expect(this.page.getByRole("progressbar")).not.toBeVisible();
  }

  async verifyHasTarget(name: string) {
    await expect(this.target(name)).toBeVisible();
  }

  async verifyHasTargets(names: string[]) {
    const actualTargets = await this.targetList
      .getByRole("link")
      .locator(".MuiListItemText-primary")
      .allTextContents();
    expect(actualTargets).toEqual(names);
  }

  async selectTarget(targetName: string): Promise<TargetPage> {
    return await test.step(`select target ${targetName}`, async () => {
      await this.target(targetName).click();
      await Promise.all([
        this.page.waitForURL((url) => url.pathname.startsWith("/target/")),
        expect(this.pageHeader).not.toBeVisible(),
      ]);

      const targetPage = new TargetPage(this.page, this.name, targetName);
      await targetPage.verifyIsOnPage();
      return targetPage;
    });
  }

  async reorderTarget(subjectName: string, toName: string) {
    await test.step(`reorder target ${subjectName} to ${toName}`, async () => {
      await dragTo(this.page, this.target(subjectName), this.target(toName));
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

  async createTarget(name: string) {
    await test.step("create target", async () => {
      await this.createTargetButton.click();
      await expect(
        this.page.getByRole("heading", {
          name: "Create new prayer target",
        })
      ).toBeVisible();
      await this.nameInput.fill(name);
      await this.confirmButton.click();
      await this.verifyHasTarget(name);
    });
  }

  private get pageHeader() {
    return this.page.getByRole("heading", { name: this.name });
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

  private get createTargetButton() {
    return this.page.getByRole("button", { name: "Create new prayer target" });
  }

  private get nameInput() {
    return this.page.getByRole("textbox", { name: "Name" });
  }

  private get targetList() {
    return this.page.getByRole("list", { name: "prayer targets" });
  }

  private target(name: string) {
    return this.targetList.getByRole("link", { name });
  }
}
