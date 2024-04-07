import { test, expect } from "@playwright/test";

const testUserSecret = process.env["TEST_USER_SECRET"] ?? "";

test("has correct title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Group Prayer Journal");
  await expect(page.getByText("Sign in to use the application")).toBeVisible();
});

test("can sign in and sign out", async ({ page }) => {
  await page.goto("/");

  const signInButton = page.getByRole("button", { name: "Sign in" });
  await expect(signInButton).toBeVisible();
  await signInButton.click();

  await expect(page).toHaveTitle("Sign In");

  const testUserSecretInput = page.getByRole("textbox", {
    name: "Test user secret",
  });
  const testUserSecretSignInButton = page.getByRole("button", {
    name: "Sign in with Test user secret",
  });
  await expect(testUserSecretInput).toBeVisible();
  await expect(testUserSecretSignInButton).toBeVisible();

  await testUserSecretInput.fill(testUserSecret);
  await testUserSecretSignInButton.click();

  await expect(page).toHaveTitle("Group Prayer Journal");
  await expect(signInButton).not.toBeVisible();

  const avatar = page.getByLabel("Test User");
  await expect(avatar).toBeVisible();
  await avatar.click();

  const signOutMenuItem = page.getByRole("menuitem", { name: "Sign out" });
  await expect(signOutMenuItem).toBeVisible();
  await signOutMenuItem.click();

  await expect(page.getByText("Sign in to use the application")).toBeVisible();
  await expect(signInButton).toBeVisible();
});
