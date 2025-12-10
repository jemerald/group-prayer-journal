import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
// import eslint from "@eslint/js";
// import { defineConfig } from "eslint/config";
// import tseslint from "typescript-eslint";

// export default defineConfig(
//   eslint.configs.recommended,
//   tseslint.configs.recommended
// );

// {
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "project": "./tsconfig.json"
//   },
//   "plugins": ["@typescript-eslint"],
//   "extends": ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
//   "rules": {
//     "@typescript-eslint/consistent-type-imports": "warn"
//   }
// }
