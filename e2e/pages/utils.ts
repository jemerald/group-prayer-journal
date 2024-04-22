import type { Locator, Page } from "@playwright/test";

export async function dragTo(page: Page, subject: Locator, target: Locator) {
  const targetRect = await target.boundingBox();
  if (targetRect) {
    await subject.hover();
    await page.mouse.down();

    await page.mouse.move(
      targetRect.x + targetRect.width / 2,
      targetRect.y + targetRect.height / 2,
      { steps: 10 }
    );

    await page.mouse.up();

    await page.waitForTimeout(5000);
  } else {
    throw new Error(`element not found`);
  }
}
