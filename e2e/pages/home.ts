import { type Page, expect } from "@playwright/test";
import { JournalListPage } from "./journal-list";

const testUserSecret = process.env["TEST_USER_SECRET"] ?? "";

export class HomePage {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page).toHaveTitle("Group Prayer Journal");
  }

  async verifyIsLoggedIn() {
    await expect(
      this.page.getByText("Sign in to use the application")
    ).not.toBeVisible();
    await expect(this.signInButton).not.toBeVisible();
  }

  async verifyNotLoggedIn() {
    await expect(
      this.page.getByText("Sign in to use the application")
    ).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async signInWithTestUser(): Promise<JournalListPage> {
    await expect(this.signInButton).toBeVisible();
    await this.signInButton.click();

    await this.page.waitForURL((url) => url.pathname == "/api/auth/signin");
    await expect(this.page).toHaveTitle("Sign In");

    const testUserSecretInput = this.page.getByRole("textbox", {
      name: "Test user secret",
    });
    const testUserSecretSignInButton = this.page.getByRole("button", {
      name: "Sign in with Test user secret",
    });
    await expect(testUserSecretInput).toBeVisible();
    await expect(testUserSecretSignInButton).toBeVisible();

    await testUserSecretInput.fill(testUserSecret);
    await testUserSecretSignInButton.click();

    await this.page.waitForURL((url) => url.pathname == "/");

    return new JournalListPage(this.page);
  }

  async signOut() {
    const avatar = this.page.getByLabel("Test User");
    await expect(avatar).toBeVisible();
    await avatar.click();

    const signOutMenuItem = this.page.getByRole("menuitem", {
      name: "Sign out",
    });
    await expect(signOutMenuItem).toBeVisible();
    await signOutMenuItem.click();
  }

  private get signInButton() {
    return this.page.getByRole("button", { name: "Sign in" });
  }
}
