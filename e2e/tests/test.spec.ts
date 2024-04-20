import { test } from "@playwright/test";
import { HomePage } from "../pages/home";

test("should be able to sign in and sign out", async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();

  await homePage.verifyNotLoggedIn();

  await homePage.signInWithTestUser();
  await homePage.verifyIsLoggedIn();

  await homePage.signOut();
  await homePage.verifyNotLoggedIn();
});
