// https://github.com/prisma/prisma/issues/28838#issuecomment-3614608109
import fs from "fs";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src",
  "generated",
  "prisma",
  "client.ts",
);

try {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const badLineIndex = lines.findIndex((line) =>
      line.startsWith("globalThis"),
    );
    if (badLineIndex !== -1) {
      lines[badLineIndex] = `// ${lines[badLineIndex]}`;
      fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
      console.log("Successfully patched prisma/generated/client.ts");
    } else {
      console.log("No bad line found in prisma/generated/client.ts");
    }
  }
} catch (e) {
  console.error("Error patching prisma/generated/client.ts", e);
  process.exit(1);
}
