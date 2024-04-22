import { type Page, expect, test } from "@playwright/test";
import { dragTo } from "./utils";

export class TargetPage {
  private page: Page;
  private journalName: string;
  private name: string;

  constructor(page: Page, journalName: string, name: string) {
    this.page = page;
    this.journalName = journalName;
    this.name = name;
  }

  async verifyIsOnPage() {
    await test.step("verify is on target page", async () => {
      await expect(this.pageHeader).toBeVisible();
      const nav = this.page.getByRole("navigation");
      await expect(nav).toBeVisible();

      await expect(this.homeLink).toBeVisible();
      await expect(this.journalLink).toBeVisible();
      const navListTextContents = await nav
        .getByRole("listitem")
        .allTextContents();
      expect(navListTextContents).toEqual([
        "Home",
        this.journalName,
        this.name,
      ]);
    });
  }

  async verifyHasItem(name: string) {
    await expect(this.item(name)).toBeVisible();
  }

  async verifyHasItems(names: string[]) {
    const actualTargets = await this.itemList
      .getByRole("button")
      .locator(".MuiListItemText-primary")
      .allTextContents();
    expect(actualTargets).toEqual(names);
  }

  async createItem(name: string, useEnterKey: boolean = false) {
    await test.step("create item", async () => {
      await this.createItemButton.click();
      await expect(
        this.page.getByRole("heading", {
          name: "Create new prayer item",
        })
      ).toBeVisible();
      await this.descriptionInput.fill(name);

      if (useEnterKey) {
        await this.page.keyboard.press("Enter");
      } else {
        await this.confirmButton.click();
      }
      await this.verifyHasItem(name);
    });
  }

  async reorderItem(subjectName: string, toName: string) {
    await test.step(`reorder item ${subjectName} to ${toName}`, async () => {
      await dragTo(this.page, this.item(subjectName), this.item(toName));
    });
  }

  async archiveTarget() {
    await test.step("archive target", async () => {
      await expect(this.archiveButton).toBeVisible();
      await this.archiveButton.click();
      await expect(
        this.page.getByRole("heading", { name: "Archive prayer target" })
      ).toBeVisible();
      await this.confirmButton.click();
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

  private get journalLink() {
    return this.page
      .getByRole("navigation")
      .getByRole("link", { name: this.journalName });
  }

  private get itemList() {
    return this.page.getByRole("list", { name: "prayer items" });
  }

  private item(name: string) {
    return this.itemList.getByRole("button", { name }).first();
  }

  private get createItemButton() {
    return this.page.getByRole("button", { name: "Create new prayer item" });
  }

  private get descriptionInput() {
    return this.page.getByRole("textbox", { name: "Description" });
  }

  private get archiveButton() {
    return this.page.getByRole("button", { name: "Archive prayer target" });
  }

  private get confirmButton() {
    return this.page.getByRole("button", { name: "Confirm" });
  }
}
