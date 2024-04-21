import { setupTestUser } from "./utils/db";

async function globalSetup() {
  await setupTestUser();
}

export default globalSetup;
